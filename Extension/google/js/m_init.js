let m_sold_item_href = window.location.href;
let m_sold_item_topHref = top.location.href;
//是否正式 如果正式则请求网上的js 否则调试本地

//如果请求的页面与浏览器页面相同则执行(防止包含iframe重复请求js)
if (m_sold_item_href && m_sold_item_href == m_sold_item_topHref) {
    //传入对应的url 获取对应的js
    //截取字符串前面一段
    m_sold_item_href = m_sold_item_href.split('?')[0];
    chrome.extension.sendMessage({type: 1, href: m_sold_item_href}, (data) => {
    });
}

