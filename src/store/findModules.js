const requireModel = require.context(
    ".",
    true,
    /^(?!.*(actions|mutations|getters|index|findModules|interfaces)).*\.js$/
  );
  const modules = {};
  requireModel.keys().forEach((item) => {
    console.log(item.split(".js")[0]);
    const moduleName = item.replace("./", "").replace("/state.js", "");
    modules[moduleName] = {
      ...requireModel(item).default,
    };
  });
  export default modules;