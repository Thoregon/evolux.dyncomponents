/**
 * defines all errors used in dyncomponents
 *
 * @author: blukassen
 */
import EError from '/evolux.supervise/lib/error/eerror';

export default {
    errNotImplemented:          (msg) => new EError(`Not implemented: ${msg}`, "DYCMP:00001"),
    errComponentIdMissing:      (msg) => new EError("'id' must be defined by the messenger interface" + msg ? `: ${msg}` : "", "DYCMP:00002"),
    errComponentNotFound:       (msg) => new EError(`Component not found: ${msg}`, "DYCMP:00003"),
    errIrregularComponent:      (msg) => new EError(`Component irregular, can't be loaded: ${msg}`, "DYCMP:00004"),
};
