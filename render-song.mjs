// render-song.mjs: drive no-me-creas.html in headless Chrome.
//   node render-song.mjs --sheet=44.6,57,63.9 --cols=3 --width=640 --out=out/sheet.jpg   contact sheet (fast visual check)
//   node render-song.mjs                                                               the full MP4 (frames piped into ffmpeg)
//   node render-song.mjs --clip=43.8:63                                                just a section
// Options: --chrome=<path to chrome>  --ffmpeg=<path to ffmpeg> (or env FFMPEG; default: ffmpeg on PATH)  --fps=24
import puppeteer from 'puppeteer-core';
import {spawn} from 'node:child_process';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {dirname,resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {once} from 'node:events';

const args=Object.fromEntries(process.argv.slice(2).map(a=>{const i=a.indexOf('=');return i<0?[a.replace(/^--/,''),true]:[a.slice(2,i),a.slice(i+1)]}));
const meta=JSON.parse(readFileSync(args.meta||'song/no-me-creas/audio-info.json','utf8'));
const fps=Number(args.fps||24), width=Number(args.width||1920), height=Math.round(width*9/16);
const chrome=args.chrome||process.env.CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe';
const browser=await puppeteer.launch({executablePath:chrome,headless:true,protocolTimeout:180000,args:['--allow-file-access-from-files','--ignore-gpu-blocklist','--use-angle=d3d11','--enable-gpu-rasterization','--disable-background-timer-throttling']});
let encoder;
try{
  const page=await browser.newPage();
  page.on('pageerror',e=>console.error(e));
  await page.goto(pathToFileURL(resolve(args.page||'no-me-creas.html')).href+'?render',{waitUntil:'networkidle0'});
  await page.waitForFunction('window.ready === true',{timeout:60000});
  console.log('GPU:',await page.evaluate(()=>window.gpuInfo()));
  const out=args.out||(args.sheet?'out/sheet.jpg':'out/No me creas.mp4');
  mkdirSync(dirname(out),{recursive:true});
  if(args.sheet){
    const result=await page.evaluate(async(ts,cols,w)=>window.renderSheet(ts,cols,w),String(args.sheet).split(',').map(Number),Number(args.cols||3),Number(args.width||640));
    writeFileSync(out,Buffer.from(result.url.split(',')[1],'base64'));console.log(out,result.ms);
  }else{
    const [start,end]=args.clip?String(args.clip).split(':').map(Number):[0,meta.duration];
    if(!(end>start&&start>=0&&end<=meta.duration))throw Error('Invalid clip range');
    encoder=spawn(args.ffmpeg||process.env.FFMPEG||meta.ffmpeg||'ffmpeg',['-y','-loglevel','error','-f','image2pipe','-framerate',String(fps),'-c:v','mjpeg','-i','-','-ss',String(start),'-t',String(end-start),'-i',meta.audio,'-map','0:v','-map','1:a','-vf',`scale=${width}:${height}`,'-c:v','libx264','-preset','fast','-crf','19','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-af','apad','-t',String(end-start),'-movflags','+faststart',out],{stdio:['pipe','inherit','inherit']});
    const completion=new Promise((ok,bad)=>{encoder.once('error',bad);encoder.once('close',code=>code===0?ok():bad(Error('ffmpeg exited '+code)))});
    completion.catch(()=>{});
    encoder.stdin.on('error',()=>{});
    const frames=Math.ceil((end-start)*fps-1e-7), begun=Date.now();
    for(let i=0;i<frames;i++){
      const data=await page.evaluate(async t=>window.renderAt(t,'image/jpeg',.94),start+i/fps);
      if(encoder.exitCode!==null)throw Error('Encoder stopped');
      if(!encoder.stdin.write(Buffer.from(data.split(',')[1],'base64')))await once(encoder.stdin,'drain');
      if(i%120===0||i===frames-1)console.log(`${i+1}/${frames} frames · ${Math.round((Date.now()-begun)/(i+1))} ms/frame`);
    }
    encoder.stdin.end();await completion;console.log('Wrote '+out);
  }
}finally{
  if(encoder&&encoder.exitCode===null)encoder.kill();
  // Some Windows GPU drivers stall Chrome shutdown after many cached images.
  // Only terminate the browser process launched by this renderer if needed.
  const closeTimer=setTimeout(()=>browser.process()?.kill(),10000);
  try{await browser.close()}finally{clearTimeout(closeTimer)}
}
