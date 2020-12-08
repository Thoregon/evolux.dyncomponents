/**
 * This example works ony in browser environments
 * NodeJS does not support data url's in import()
 *
 * @author: Bernhard Lukassen
 * @licence: MIT
 * @see: {@link https://github.com/Thoregon}
 */

const importJS = async (js) => {
    let url = "data:application/javascript;charset=utf-8," + encodeURIComponent(js);
    let module = await import(url);
    return module;
}

(async () => {
    const js = "export const a = { a: 'A' };";
    let module = await importJS(js);
    console.log(JSON.stringify(module.a));
})();
