self.addEventListener('message', function(e) {
    //Received a job from the caller: handle it
    var data = e.data;
    console.log('worker: received a task');
    console.log(data);
    switch (data.cmd) {
        case 'doThis':
            self.postMessage({cmd:'start'});
            doThis();
            self.postMessage({cmd:'completed'});
            break;
        case 'stop':
            // Terminates the worker.
            self.close();
            break;
        default:
            self.postMessage({cmd:'unknown', msg:'Unknown command: \'' + data.cmd + '\''});
            break;
    }
});

function doThis(){
    console.log('worker: doThis()');
    var iteration = 0;
    var beforeTime = new Date().getTime();
    var currentTime = new Date().getTime()-beforeTime;
    var lap = 0;
    while(currentTime < 3000) {
        currentTime = new Date().getTime() - beforeTime;
        iteration++;
        if(iteration - lap > 100000) {
            //Post the progress every 100000 iterations to the caller
            self.postMessage({cmd: 'progress', msg:iteration, time:currentTime});
            lap = iteration;
        }
    }
}