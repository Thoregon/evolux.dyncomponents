/**
 *
 *
 * @author: blukassen
 */

export const bootlogger = {
    log(level, ...message) {
        // todo: print timestamp formated
        console.log(level, ':', ...message);
    },

    info(...message) {
        this.log('info', ...message);
    },

    warn(...message) {
        this.log('warn', ...message);
    },

    error(...message) {
        this.log('error', ...message);
    },

    debug(...message) {
        this.log('debug',... message);
    },
};
