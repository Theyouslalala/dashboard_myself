export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/github/index",
    "pages/leetcode/index",
    "pages/steam/index",
  ],
  tabBar: {
    color: "#94a3b8",
    selectedColor: "#22d3ee",
    backgroundColor: "#0f172a",
    borderStyle: "black",
    list: [
      {
        pagePath: "pages/index/index",
        text: "概览",
        iconPath: "assets/tab-home.png",
        selectedIconPath: "assets/tab-home-active.png",
      },
      {
        pagePath: "pages/github/index",
        text: "GitHub",
        iconPath: "assets/tab-github.png",
        selectedIconPath: "assets/tab-github-active.png",
      },
      {
        pagePath: "pages/steam/index",
        text: "Steam",
        iconPath: "assets/tab-steam.png",
        selectedIconPath: "assets/tab-steam-active.png",
      },
    ],
  },
  window: {
    backgroundTextStyle: "dark",
    navigationBarBackgroundColor: "#0f172a",
    navigationBarTitleText: "Dashboard",
    navigationBarTextStyle: "white",
    backgroundColor: "#020617",
  },
});
