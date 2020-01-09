<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8" />
    <title>IconFont Demo</title>
    <link rel="shortcut icon" href="https://gtms04.alicdn.com/tps/i4/TB1_oz6GVXXXXaFXpXXJDFnIXXX-64-64.ico"
        type="image/x-icon" />
    <link rel="stylesheet" href="https://g.alicdn.com/thx/cube/1.3.2/cube.min.css" />
    <link rel="stylesheet" href="demo.css" />
    <link rel="stylesheet" href="iconfont.css" />
    <script src="iconfont.js"></script>
    <!-- jQuery -->
    <script src="https://a1.alicdn.com/oss/uploads/2018/12/26/7bfddb60-08e8-11e9-9b04-53e73bb6408b.js"></script>
    <!-- 代码高亮 -->
    <script src="https://a1.alicdn.com/oss/uploads/2018/12/26/a3f714d0-08e6-11e9-8a15-ebf944d7534c.js"></script>
</head>

<body>
    <div class="main">
        <h1 class="logo"><a href="https://www.iconfont.cn/" title="iconfont 首页" target="_blank">&#xe86b;</a></h1>
        <div class="nav-tabs">
            <ul id="tabs" class="dib-box">
                <li class="dib active"><span>Font class</span></li>
                <li class="dib"><span>Symbol</span></li>
            </ul>
        </div>
        <div class="tab-container">
            <div class="content font-class">
                <ul class="icon_lists dib-box">
                    <% _.each(items, function(items) { %>
                    <li class="dib">
                        <div class="iconfont <%= items.name %>"></div>
                        <div class="code-name"><%= items.name %></div>
                    </li>
                    <% }) %>
                </ul>
                <div class="article markdown">
                    <h2 id="font-class-">font-class 引用</h2>
                    <hr />

                    <p>
                        font-class 是 Unicode 使用方式的一种变种，主要是解决 Unicode 书写不直观，语意不明确的问题。
                    </p>
                    <p>与 Unicode 使用方式相比，具有如下特点：</p>
                    <ul>
                        <li>兼容性良好，支持 IE8+，及所有现代浏览器。</li>
                        <li>相比于 Unicode 语意明确，书写更直观。可以很容易分辨这个 icon 是什么。</li>
                        <li>
                            因为使用 class 来定义图标，所以当要替换图标时，只需要修改 class 里面的 Unicode 引用。
                        </li>
                        <li>不过因为本质上还是使用的字体，所以多色图标还是不支持的。</li>
                    </ul>
                    <p>使用步骤如下：</p>
                    <h3 id="-fontclass-">第一步：引入项目下面生成的 fontclass 代码：</h3>
                    <pre><code class="language-html">&lt;link rel="stylesheet" href="./iconfont.css"&gt;
</code></pre>
                    <h3 id="-">第二步：挑选相应图标并获取类名，应用于页面：</h3>
                    <pre><code class="language-html">&lt;span class="iconfont icon-xxx"&gt;&lt;/span&gt;
</code></pre>
                    <blockquote>
                        <p>" iconfont" 是你项目下的 font-family。可以通过编辑项目查看，默认是 "iconfont"。</p>
                    </blockquote>
                </div>
            </div>
            <div class="content symbol">
                <ul class="icon_lists dib-box">
                    <% _.each(items, function(items) { %>
                    <li class="dib">
                        <svg class="iconfont svg-icon" aria-hidden="true">
                            <use xlink:href="#<%= items.name %>"></use>
                        </svg>
                        <div class="code-name"><%= items.name %></div>
                    </li>
                    <% }) %>
                </ul>
                <div class="article markdown">
                    <h2 id="symbol-">Symbol 引用</h2>
                    <hr />

                    <p>
                        这是一种全新的使用方式，应该说这才是未来的主流，也是平台目前推荐的用法。相关介绍可以参考这篇<a href="">文章</a>
                        这种用法其实是做了一个 SVG 的集合，与另外两种相比具有如下特点：
                    </p>
                    <ul>
                        <li>支持多色图标了，不再受单色限制。</li>
                        <li>
                            通过一些技巧，支持像字体那样，通过 <code>font-size</code>,
                            <code>color</code> 来调整样式。
                        </li>
                        <li>兼容性较差，支持 IE9+，及现代浏览器。</li>
                        <li>浏览器渲染 SVG 的性能一般，还不如 png。</li>
                    </ul>
                    <p>使用步骤如下：</p>
                    <h3 id="-symbol-">第一步：引入项目下面生成的 symbol 代码：</h3>
                    <pre><code class="language-html">&lt;script src="./iconfont.js"&gt;&lt;/script&gt;
</code></pre>
                    <h3 id="-css-">第二步：加入通用 CSS 代码（引入一次就行）：</h3>
                    <pre><code class="language-html">&lt;style&gt;
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
&lt;/style&gt;
</code></pre>
                    <h3 id="-">第三步：挑选相应图标并获取类名，应用于页面：</h3>
                    <pre><code class="language-html">&lt;svg class="icon" aria-hidden="true"&gt;
  &lt;use xlink:href="#icon-xxx"&gt;&lt;/use&gt;
&lt;/svg&gt;
</code></pre>
                </div>
            </div>
        </div>
    </div>
    <script>
        $(document).ready(function () {
            $('.tab-container .content:first').show();

            $('#tabs li').click(function (e) {
                var tabContent = $('.tab-container .content');
                var index = $(this).index();

                if ($(this).hasClass('active')) {
                    return;
                } else {
                    $('#tabs li').removeClass('active');
                    $(this).addClass('active');

                    tabContent
                        .hide()
                        .eq(index)
                        .fadeIn();
                }
            });
        });
    </script>
</body>

</html>