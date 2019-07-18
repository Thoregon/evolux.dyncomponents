/**
 * defines all errors used in dyncomponents
 *
 * @author: blukassen
 */
import EError from 'evolux.supervise/lib/error/eerror';

export default {
    errComponentIdMissing: (msg) => new EError("'id' must be defined by the messenger interface" + msg ? `: ${msg}` : "", "DYCMP:00001")
};
