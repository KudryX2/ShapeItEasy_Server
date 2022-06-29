var os 	= require('os-utils');

module Monitor{

    function sleep (time : number) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    export async function startMonitor(){

        console.log('Monitor recursos START');

        while(true){
            os.cpuUsage(function(cpu: string){
                console.log('CPU : ' + Number(cpu).toFixed(4) + '   MEMORY : ' + Number(os.freemem()).toFixed(2));
            });

            await sleep(500);
        }

    }

}

export {Monitor};