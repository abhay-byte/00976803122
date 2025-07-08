import axios from 'axios';

export async function Log(stack, level, pkg, message) {
    try {
        await axios.post('http://20.244.56.144/evaluation-service/logs', {
            stack,
            level,
            package: pkg,
            message,
        });
    } catch (err) {
        // do nothing
    }
}
