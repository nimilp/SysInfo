function SystemInfo(){

  const diskUsage = require('diskusage');
  const os = require('os');

}
SystemInfo.prototype.init = function(){
  SystemInfo.prototype.setMemory('free');
  SystemInfo.prototype.setMemory('total');
  SystemInfo.prototype.setUpTimes();
  SystemInfo.prototype.setCPUs();
  SystemInfo.prototype.setUpNetwork();
  SystemInfo.prototype.getSystemUsage();
}
SystemInfo.prototype.getSystemUsage = function(){
    let path = os.platform() == "win32" ? "c:":"/";
    const freeDisk = document.querySelector('freeDisk');
    const totalDisk = document.querySelector('totalSpace');
    const avail = document.querySelector('available');
    try{
      let info = diskUsage.checkSync(path)
      freeDisk.innerHTML = info.free
      totalDisk.innerHTML = info.total;
      avail.innerHTML = info.available;
    } catch(error){

    }
}
SystemInfo.prototype.setUpNetwork = function (){
    const network = os.networkInterfaces();
    if(!network){
      return;
    }
    const wirelessEle = document.querySelector('#wireless');
    const ethernet = document.querySelector('#ethernet');
    for( var prop in network){
      if(prop === "en0" || prop === "eth0"){
      for(var i =0; i< network[prop].length;i++){
        let property = network[prop][i];
        if(!(property.scopeid)){
            switch (prop) {
              case "en0":
                wireless.innerHTML = property.address;
                wireless.addEventListener('click', function(e){
                  clipboard.writeText(property.address);
                  console.log(property.address)
                })
                break;
                case "eth0":
                  ethernet.innerHTML = property.address;
                  ethernet.addEventListener('click', function(e){
                    clipboard.writeText(property.address);
                    console.log(property.address)
                  })
                  break;
              default:

            }
        }
      }
    }
    }
  }
SystemInfo.prototype.inHours = function (timeObject){

    switch (timeObject.times) {
      case 1:
          timeObject.desc = "Minutes";
        break;
      case 2:
          timeObject.desc = "Hours";
          break;
      default:
        timeObject.desc = "Seconds"
        break;
    }
    if(timeObject.times >=2){
      return timeObject;
    }

    if(timeObject.value > 60){
      timeObject.times = timeObject.times+1;
      timeObject.value = parseInt(timeObject.value/60);
      return this.inHours(timeObject)
    }
  }



SystemInfo.prototype.setMemory =function ( type){

    const memInfo = type=="free"?os.freemem():os.totalmem();
    const ele = document.querySelector("#"+type);
    const mem = this.readableMemory({value :memInfo, desc:"Bytes"})
    ele.innerHTML = mem.value+" "+mem.desc
  }

SystemInfo.prototype.setUpTimes =function (){
    const memInfo = os.uptime();
    const uptime = document.querySelector("#uptime");
    let time = this.inHours({value:memInfo,times:0});
    if(time.value>=24){
      time.value = parseInt(time.value/24)
      time.desc = "Days"
    }
    uptime.innerHTML = parseInt(time.value)+" "+time.desc
  }
SystemInfo.prototype.setCPUs =function (){
    const cpusArray = os.cpus();
    if(!cpusArray){
      return;
    }
    const cpus = document.querySelector("#cpus");
    let ul = document.createElement("ul");
    cpus.appendChild(ul);
    for(var i =0;i<cpusArray.length;i++){
      let li = document.createElement("li");
      ul.appendChild(li);
      li.innerHTML = cpusArray[i].model;
    }
  }
  // ipcRenderer.on("mu:data",(e, data)=>{
  //   // os = data.os;
  //
  //   //alert(data.memInfo.free)
  // });
SystemInfo.prototype.readableMemory = function (mem){

    if(mem.value <1024){
      return mem;
    }

    mem.value=mem.value/1024;
    switch (mem.desc) {
      case "Bytes":
        mem.desc = "KB";
        break;
      case "KB":
        mem.desc = "MB";
        break;
      case "MB":
        mem.desc = "GB";
        break;
      default:
        break;
    }
    // mem.desc = mem.desc === "Bytes"? "MB": (mem.desc==="MB"? "GB":mem.desc);
    return this.readableMemory(mem);
  }
