import { ref } from "vue";

const useInferencePerfTimer = () => {
    let startTime: number;
    let lastTime: number;
    let nTokens = 0;
    let tps = ref(0);
    let _iid = 0;

    const _ticker = (interval: number) => {
        console.log("Start ticker", interval);
        _iid = setInterval(function() {
            console.log("tick")
            const currentTime = performance.now();
            const elapsedNs = Number(currentTime - lastTime);
            const elapsedSec = elapsedNs / 1000;
            // calculate tokens per second
            tps.value = nTokens / elapsedSec;
            console.log("Ticker TPS", tps.value)

        }, interval);
    }

    const onToken = () => {
        nTokens++;
        //console.log(nTokens)
    }

    const start = (interval: number) => {
        startTime = performance.now();
        lastTime = startTime;
        _ticker(interval)
    };

    const time = () => _end(false).toString();

    const _end = (raw: boolean) => {
        console.log("END PERF")
        if (_iid != 0) {
            clearInterval(_iid);
        }
        if (!startTime) {
            throw new Error("the timer has not started, can not end it")
        }
        const endTime = performance.now();
        const duration = endTime - startTime;
        if (raw) {
            return duration
        }
        const humanizedTime = _formatDuration(duration);
        return humanizedTime
    }

    const _formatDuration = (ms: number) => {
        const seconds = ms / 1000;
        const minutes = seconds / 60;
        if (ms < 1000) return `${ms.toFixed(2)} milliseconds`;
        if (seconds < 60) return `${seconds.toFixed(1)} seconds`;
        return `${minutes.toFixed()} minutes ${(seconds % 60).toFixed()} seconds`;
    }

    return {
        start,
        time,
        onToken,
        tps,
    }
}

export { useInferencePerfTimer }