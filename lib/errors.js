/**
 * defines all errors used in dyncomponents
 *
 * @author: blukassen
 */
const EError = require('evolux.supervise/lib/error/eerror');

module.exports = {
    errComponentIdMissing: (msg) => new EError("'id' must be defined by the messenger interface" + msg ? `: ${msg}` : "", "DYCMP:00001")
};
