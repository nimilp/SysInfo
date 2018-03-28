function SystemInfo(){
  this.clipboardContents = [];
}
SystemInfo.prototype.init = function(){
  SystemInfo.prototype.setMemory('free');
  SystemInfo.prototype.setMemory('total');
  SystemInfo.prototype.setUpTimes();
  // SystemInfo.prototype.setCPUs();
  SystemInfo.prototype.setUpNetwork();

  SystemInfo.prototype.getSystemUsage();
}

SystemInfo.prototype.readClipboard = function(text){
  console.log(this.clipboardContents);
  if(this.clipboardContents.indexOf(text) === -1){
    console.log(text)
    this.clipboardContents.push(text);
    const el = document.querySelector('#cc');
    let div = document.createElement('div');
    let divNum = document.createElement('div');
    divNum.className="floatLeft divNum"
    divNum.innerHTML = this.clipboardContents.length+". ";
    let cc = document.createElement('div');
    // div.setAttribute('id', 'cc_'+(this.clipboardContents.length));
    cc.addEventListener('click', function(e){
        clipboard.writeText(text);
      }
    );
    div.className =  "pad10 defaultMouse padTop5 cc";
    div.appendChild(divNum);
    div.appendChild(cc);
    el.appendChild(div);
    cc.innerHTML=text;
  }
}
SystemInfo.prototype.getSystemUsage = function(){


    const totalDisk = document.querySelector('totalSpace');
    const avail = document.querySelector('available');

    diskUsage(function(info){
      const freeDisk = document.querySelector('#freeDisk'),
      totalDisk = document.querySelector('#totalSpace');
      let free, total, avail = (info.total.size-info.total.free),available;
      free=SystemInfo.prototype.readableMemory({value :info.total.free, desc:"Bytes"});
      total = SystemInfo.prototype.readableMemory({value :info.total.size, desc:"Bytes"});
      available = SystemInfo.prototype.readableMemory({value :avail, desc:"Bytes"});
      freeDisk.innerHTML = free.value+" "+free.desc;
      totalDisk.innerHTML = total.value+" "+total.desc;
      document.querySelector('#available').innerHTML = available.value+" "+available.desc;
  });
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
          if(!(property.scopeid) && property.scopeid !==0){

              switch (prop) {
                case "en0":
                  wireless.innerHTML = property.address;
                  wireless.addEventListener('click', function(e){
                    clipboard.writeText(property.address);
                    let myNotification = new Notification('System Info', {
                      body: 'Wireless address '+property.address+' copied to clipboard successfully!',
                      silent:true
                    });
                  })
                  break;
                  case "eth0":
                    ethernet.innerHTML = property.address;
                    ethernet.addEventListener('click', function(e){
                      clipboard.writeText(property.address);
                      let myNotification = new Notification('System Info', {
                        body: 'Ethernet address '+property.address+' copied to clipboard successfully!',
                        silent:true
                      });
                    });
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
SystemInfo.prototype.readableMemory = function (mem){

    if(mem.value <1024){
      return mem;
    }

    mem.value=parseFloat(mem.value/1024).toFixed(2);
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
      case "GB":
        mem.desc = "TB";
        break;
      default:
        break;
    }
    // mem.desc = mem.desc === "Bytes"? "MB": (mem.desc==="MB"? "GB":mem.desc);
    return this.readableMemory(mem);
}
