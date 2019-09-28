/**
 * defines all errors used in dyncomponents
 *
 * @author: blukassen
 */
import EError from '/evolux.supervise/lib/error/eerror.mjs';

export const ErrNotImplemented          = (msg)         => new EError(`Not implemented: ${msg}`, "DYCMP:00001");
export const ErrComponentIdMissing      = (msg)         => new EError("'id' must be defined by the messenger interface" + msg ? `: ${msg}` : "", "DYCMP:00002");
export const ErrComponentNotFound       = (msg)         => new EError(`Component not found: ${msg}`, "DYCMP:00003");
export const ErrIrregularComponent      = (msg, cause)  => new EError(`Component irregular, can't be loaded: ${msg}`, "DYCMP:00004", cause);
export const ErrLocationNotFound        = (msg)         => new EError(`Location not found: ${msg}`, "DYCMP:00005");
export const ErrComponentStatus         = (msg, cause)  => new EError(`Component state change: ${msg}`, "DYCMP:00006", cause);
export const ErrNoServiceComponent      = (msg)         => new EError(`Not a service component: ${msg}`, "DYCMP:00007");

