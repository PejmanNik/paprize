import logger from "loglevel";
import { Paginator } from "../paginate/Paginator";
import { DebugModeType, setDebugMode } from "../utilities/debugMode";
import { h, render } from "preact";
import { createParagraph } from "./words";

const App = () => {
  return h("div", { id: "app" }, [
    // First section
    h("div", { id: "1" }, [
      h("h1", { id: "1.1" }, "Title 1"),
      h("div", { id: "1.2" }, [
        h("p", { id: "1.2" }, createParagraph(80, 0.2)),
      ]),
    ]),

    // Second section
    h("div", { id: "2" }, [
      h("h1", { id: "2.1" }, "Title 2"),
      h("div", { id: "2.2" }, [
        h("p", { id: "2.2.1" }, createParagraph(60, 0.3)),
        h(
          "p",
          { id: "2.2.2", style: { wordBreak: "break-all" } },
          Array.from({ length: 400 }, (_, i) => i + 1).join(",")
        ),
        h("h3", { id: "2.3" }, "End"),
      ]),
    ]),
  ]);
};

render(App(), document.body);

logger.setLevel("trace");
setDebugMode(DebugModeType.highlight);
const paginator = new Paginator(document.getElementById("app")!, {
  width: 870,
  height: 220,
});

paginator.paginate();
