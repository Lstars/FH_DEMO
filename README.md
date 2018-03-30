# 柏林


# 项目结构

```
.
├── README.md
├── build
│   ├── build.js
│   ├── check-versions.js
│   ├── utils.js
│   ├── vue-loader.conf.js
│   ├── webpack.base.conf.js
│   ├── webpack.dev.conf.js
│   └── webpack.prod.conf.js
├── config
│   ├── dev.env.js
│   ├── index.js
│   ├── prod.env.js
│   └── sit.env.js
├── favicon.ico
├── index.html
├── package.json
├── src
│   ├── App.vue
│   ├── api
│   │   ├── auditCenter.js
│   │   ├── eeop.js
│   │   ├── fulfillmentCenter.js
│   │   ├── houseManage.js
│   │   ├── login.js
│   │   ├── serviceManage.js
│   │   └── userManage.js
│   ├── assets
│   │   ├── 404_images
│   │   │   ├── 404.png
│   │   │   └── 404_cloud.png
│   │   ├── banner.jpg
│   │   ├── banner1.jpg
│   │   ├── defaultAvatar.png
│   │   ├── lazyLoad@1x.png
│   │   ├── lazyLoad@2x.png
│   │   ├── lazyLoad@3x.png
│   │   └── noPic.jpg
│   ├── components
│   │   ├── AreaSelect
│   │   │   ├── cityData.js
│   │   │   └── index.vue
│   │   ├── Hamburger
│   │   │   └── index.vue
│   │   ├── Icon-svg
│   │   │   └── index.vue
│   │   ├── Preview
│   │   │   └── index.vue
│   │   ├── Screenfull
│   │   │   └── index.vue
│   │   └── ThemePicker
│   │       └── index.vue
│   ├── directive
│   │   ├── clipboard
│   │   │   ├── clipboard.js
│   │   │   └── index.js
│   │   ├── sticky.js
│   │   └── waves
│   │       ├── index.js
│   │       ├── waves.css
│   │       └── waves.js
│   ├── filters
│   │   └── index.js
│   ├── icons
│   │   ├── index.js
│   │   └── svg
│   │       ├── 404.svg
│   │       ├── activity.svg
│   │       ├── bug.svg
│   │       ├── chart.svg
│   │       ├── clipboard.svg
│   │       ├── component.svg
│   │       ├── dashboard.svg
│   │       ├── documentation.svg
│   │       ├── drag.svg
│   │       ├── email.svg
│   │       ├── example.svg
│   │       ├── excel.svg
│   │       ├── eye.svg
│   │       ├── form.svg
│   │       ├── icon.svg
│   │       ├── international.svg
│   │       ├── language.svg
│   │       ├── lock.svg
│   │       ├── message.svg
│   │       ├── money.svg
│   │       ├── password.svg
│   │       ├── people.svg
│   │       ├── peoples.svg
│   │       ├── qq.svg
│   │       ├── shoppingCard.svg
│   │       ├── star.svg
│   │       ├── tab.svg
│   │       ├── table.svg
│   │       ├── theme.svg
│   │       ├── trendChart1.svg
│   │       ├── trendChart2.svg
│   │       ├── trendChart3.svg
│   │       ├── user.svg
│   │       ├── wechat.svg
│   │       └── zip.svg
│   ├── main.js
│   ├── router
│   │   ├── _import_development.js
│   │   ├── _import_production.js
│   │   └── index.js
│   ├── store
│   │   ├── getters.js
│   │   ├── index.js
│   │   └── modules
│   │       ├── app.js
│   │       ├── permission.js
│   │       └── user.js
│   ├── styles
│   │   ├── element-ui.scss
│   │   ├── index.scss
│   │   └── mixin.scss
│   ├── utils
│   │   ├── auth.js
│   │   ├── fetch.js
│   │   ├── index.js
│   │   └── validate.js
│   ├── vendor
│   │   ├── Blob.js
│   │   └── Export2Excel.js
│   └── views
│       ├── 404.vue
│       ├── auditManage
│       │   ├── auditPublishList.vue
│       │   ├── auditSignatures.vue
│       │   ├── components
│       │   └── publishedList.vue
│       ├── dashboard
│       │   └── index.vue
│       ├── eeop
│       │   ├── activety.vue
│       │   ├── advertis.vue
│       │   ├── banner.vue
│       │   ├── components
│       │   └── interview.vue
│       ├── fulfillmentCenter
│       │   ├── coupon.vue
│       │   └── statisticsQuery.vue
│       ├── houseManage
│       │   ├── components
│       │   ├── dataReport.vue
│       │   ├── promotionDisplay.vue
│       │   └── queryCenter.vue
│       ├── layout
│       │   ├── AppMain.vue
│       │   ├── Layout.vue
│       │   ├── Levelbar.vue
│       │   ├── Navbar.vue
│       │   ├── Sidebar.vue
│       │   ├── SidebarItem.vue
│       │   └── index.js
│       ├── login
│       │   └── index.vue
│       ├── serviceManage
│       │   ├── lookRecord.vue
│       │   └── searchHouseSource.vue
│       └── userManage
│           ├── applyRegister.vue
│           ├── components
│           ├── feedback.vue
│           ├── initCustomerList.vue
│           ├── initOrgList.vue
│           └── userList.vue
├── static
│   └── loading-spin.svg
└── tree.md

40 directories, 131 files

```


- [线上地址](https://bop.mdguanjia.com)      

## 开发
```bash
	# 克隆项目
	git clone https://github.com/BolinWang/FT_EEOP.git

	# 安装依赖
	npm install
	   
	# 建议不要用cnpm安装 会有各种诡异的bug 可以通过如下操作解决 npm 下载速度慢的问题
	npm install --registry=https://registry.npm.taobao.org

	# 启动服务
	npm run dev
```
浏览器访问 http://localhost:9528

## 发布
```bash
	# 构建测试环境
	npm run build:sit

	# 构建生成环境
	npm run build:prod
```


更多信息请联系Bolin


## License

MIT