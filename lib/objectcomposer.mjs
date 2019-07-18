/**
 *
 *
 * @author: blukassen
 */
const ObjectComposer =
    (...importedMethodNames) =>
        (behaviour) =>
            (...exportedMethodNames) =>
                target => {
                    const composedObject = Symbol('composedObject');
                    const instance = Symbol('instance');

                    for (const methodName of exportedMethodNames) {
                        Object.defineProperty(target.prototype, methodName, {
                            value: function (...args) {
                                if (this[composedObject] == null) {
                                    this[composedObject] = Object.assign({}, behaviour);
                                    this[composedObject][instance] = this;
                                    for (const methodName of importedMethodNames) {
                                        this[composedObject][methodName] = function (...args) {
                                            return this[instance][methodName](...args);
                                        }
                                    }
                                }
                                return this[composedObject][methodName](...args);
                            },
                            writeable: true
                        });
                    }
                    return target;
                };

export default ObjectComposer;
