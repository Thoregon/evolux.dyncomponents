/**
 * defines all errors used in dyncomponents
 *
 * @author: blukassen
 */
import EError from '/evolux.supervise/lib/error/eerror.mjs';

export const errNotImplemented          = (msg) => new EError(`Not implemented: ${msg}`, "DYCMP:00001");
export const errComponentIdMissing      = (msg) => new EError("'id' must be defined by the messenger interface" + msg ? `: ${msg}` : "", "DYCMP:00002");
export const errComponentNotFound       = (msg) => new EError(`Component not found: ${msg}`, "DYCMP:00003");
export const errIrregularComponent      = (msg) => new EError(`Component irregular, can't be loaded: ${msg}`, "DYCMP:00004");
