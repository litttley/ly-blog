(function () {

    if (PAGE_TYPE) {
        initSubHeaders()
        initApiSpecLinks()
        initLocationHashFuzzyMatching()
    }

    function initApiSpecLinks() {
        var apiContent = document.querySelector('.content.apirefer')
        if (apiContent) {
            var apiTitles = [].slice.call(apiContent.querySelectorAll('h2'))
            apiTitles.forEach(function (titleNode) {
                var ulNode = titleNode.parentNode.nextSibling
                if (ulNode.tagName !== 'UL') {
                    ulNode = ulNode.nextSibling
                }
                if (ulNode.tagName === 'UL') {
                    var specNode = document.createElement('li')
                    var specLink = createSourceSearchPath(titleNode.textContent)
                    specNode.innerHTML = '<a href="' + specLink + '" target="_blank">Source</a>'
                    ulNode.appendChild(specNode)
                }
            })
        }

        function createSourceSearchPath(query) {
            query = query
                .replace(/\([^\)]*?\)/g, '')
                .replace(/vm\./g, 'Vue.prototype.')
            return 'https://github.com/search?utf8=%E2%9C%93&q=repo%3Avuejs%2Fvue+extension%3Ajs+' + encodeURIComponent('"' + query + '"') + '&type=Code'
        }
    }

    function parseRawHash(hash) {
        // Remove leading hash
        if (hash.charAt(0) === '#') {
            hash = hash.substr(1)
        }

        // Escape characthers
        try {
            hash = decodeURIComponent(hash)
        } catch (e) {
        }
        return CSS.escape(hash)
    }

    function initLocationHashFuzzyMatching() {
        var rawHash = window.location.hash
        if (!rawHash) return
        var hash = parseRawHash(rawHash)
        var hashTarget = document.getElementById(hash)
        if (!hashTarget) {
            var normalizedHash = normalizeHash(hash)
            var possibleHashes = [].slice.call(document.querySelectorAll('[id]'))
                .map(function (el) {
                    return el.id
                })
            possibleHashes.sort(function (hashA, hashB) {
                var distanceA = levenshteinDistance(normalizedHash, normalizeHash(hashA))
                var distanceB = levenshteinDistance(normalizedHash, normalizeHash(hashB))
                if (distanceA < distanceB) return -1
                if (distanceA > distanceB) return 1
                return 0
            })
            window.location.hash = '#' + possibleHashes[0]
        }

        function normalizeHash(rawHash) {
            return rawHash
                .toLowerCase()
                .replace(/\-(?:deprecated|removed|replaced|changed|obsolete)$/, '')
        }

        function levenshteinDistance(a, b) {
            var m = []
            if (!(a && b)) return (b || a).length
            for (var i = 0; i <= b.length; m[i] = [i++]) {
            }
            for (var j = 0; j <= a.length; m[0][j] = j++) {
            }
            for (var i = 1; i <= b.length; i++) {
                for (var j = 1; j <= a.length; j++) {
                    m[i][j] = b.charAt(i - 1) === a.charAt(j - 1)
                        ? m[i - 1][j - 1]
                        : m[i][j] = Math.min(
                            m[i - 1][j - 1] + 1,
                            Math.min(m[i][j - 1] + 1, m[i - 1][j] + 1))
                }
            }
            return m[b.length][a.length]
        }
    }

    /**
     * Mobile burger menu button and gesture for toggling sidebar
     */

    function initMobileMenu() {
        var mobileBar = document.getElementById('mobile-bar')
        var sidebar = document.querySelector('.sidebar')
        var menuButton = mobileBar.querySelector('.menu-button')

        menuButton.addEventListener('click', function () {
            sidebar.classList.toggle('open')
        })

        document.body.addEventListener('click', function (e) {
            if (e.target !== menuButton && !sidebar.contains(e.target)) {
                sidebar.classList.remove('open')
            }
        })

        // Toggle sidebar on swipe
        var start = {}, end = {}

        document.body.addEventListener('touchstart', function (e) {
            start.x = e.changedTouches[0].clientX
            start.y = e.changedTouches[0].clientY
        })

        document.body.addEventListener('touchend', function (e) {
            end.y = e.changedTouches[0].clientY
            end.x = e.changedTouches[0].clientX

            var xDiff = end.x - start.x
            var yDiff = end.y - start.y

            if (Math.abs(xDiff) > Math.abs(yDiff)) {
                if (xDiff > 0) sidebar.classList.add('open')
                else sidebar.classList.remove('open')
            }
        })
    }


    /**
     * Sub headers in sidebar
     */

    function initSubHeaders() {
        var each = [].forEach
        var main = document.getElementById('main')
        var header = document.getElementById('header')
        var sidebar = document.querySelector('.sidebar')
        var content = document.querySelector('.content')

        // build sidebar
        var currentPageAnchor = sidebar.querySelector('.sidebar-link.current')
        var isAPI = document.querySelector('.content').classList.contains('apirefer')
        if (currentPageAnchor || isAPI) {
            var allHeaders = []
            var sectionContainer
            if (isAPI) {
                sectionContainer = document.querySelector('.menu-root')
            } else {
                sectionContainer = document.createElement('ul')
                sectionContainer.className = 'menu-sub'
                currentPageAnchor.parentNode.appendChild(sectionContainer)
            }
            var headers = content.querySelectorAll('h1')
            if (headers.length) {
                each.call(headers, function (h) {
                    sectionContainer.appendChild(makeLink(h))
                    var h2s = collectH2s(h);
                    allHeaders.push(h);
                    allHeaders.push.apply(allHeaders, h2s);
                    if (h2s.length) {
                        sectionContainer.appendChild(makeSubLinks(h2s, isAPI))
                    }
                })
            } else {
                headers = content.querySelectorAll('h2')
                each.call(headers, function (h) {
                    sectionContainer.appendChild(makeLink(h))
                    allHeaders.push(h)
                })
            }

            var animating = false
            sectionContainer.addEventListener('click', function (e) {

                // Not prevent hashchange for smooth-scroll
                // e.preventDefault()

                if (e.target.classList.contains('section-link')) {
                    sidebar.classList.remove('open')
                    setActive(e.target)
                    animating = true
                    setTimeout(function () {
                        animating = false
                    }, 400)
                }
            }, true)

            // make links clickable
            allHeaders.forEach(makeHeaderClickable)

            smoothScroll.init({
                speed: 400,
                offset: -140
            })
        }

        var hoveredOverSidebar = false
        sidebar.addEventListener('mouseover', function () {
            hoveredOverSidebar = true
        })
        sidebar.addEventListener('mouseleave', function () {
            hoveredOverSidebar = false
        })

        // listen for scroll event to do positioning & highlights
        window.addEventListener('scroll', updateSidebar)
        window.addEventListener('resize', updateSidebar)

        function updateSidebar() {
            var doc = document.documentElement
            var top = doc && doc.scrollTop || document.body.scrollTop
            if (animating || !allHeaders) return
            var last
            for (var i = 0; i < allHeaders.length; i++) {
                var link = allHeaders[i]
                // console.log(link)
                if (link.offsetTop + 440 > top) {
                    if (!last) {
                        last = link
                    }
                    break
                } else {
                    last = link
                }
            }
            if (last){
                setActive(last.id, !hoveredOverSidebar)
            }
        }

        function makeLink(h) {
            var link = document.createElement(h.tagName)
            var text = h.textContent.replace(/\(.*\)$/, '')
            link.innerHTML =
                '<a class="section-link" data-scroll href="#' + h.id + '">' +
                htmlEscape(text) +
                '</a>'
            return link
        }

        function htmlEscape(text) {
            return text
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
        }

        function collectH2s(h) {
            var h2s = [];
            var next = h.nextSibling
            while (next && next.tagName !== 'H1') {
                if (next.tagName === 'H2' || next.tagName === 'H3') {
                    h2s.push(next)
                }
                next = next.nextSibling
            }
            return h2s
        }

        function makeSubLinks(h3s, small) {
            var container = document.createElement('ul')
            if (small) {
                container.className = 'menu-sub'
            }
            h3s.forEach(function (h) {
                container.appendChild(makeLink(h))
            })
            return container
        }
        //设置 slide-right focus 样式
        function setActive(id, shouldScrollIntoView) {

            var previousActive = sidebar.querySelector('.section-link.active');
            var currentActive = typeof id === 'string'
                ? sidebar.querySelector('.section-link[href="#' + id + '"]')
                : id;
            if (currentActive !== previousActive) {
                if (previousActive) previousActive.classList.remove('active');
                currentActive.classList.add('active');
                var h1 = sidebar.querySelector('.parent');
                if(h1){
                    h1.className = '';
                }
                // if (currentActive.parentNode.tagName !== 'H1' ){
                    // currentActive.parentNode.parentNode.previousSibling.classList.add('parent');
                // }

                if (shouldScrollIntoView) {
                    var currentPageOffset = currentPageAnchor
                        ? currentPageAnchor.offsetTop - 8
                        : 0
                    // console.log(currentPageOffset+" currentPageOffset")
                    var currentActiveOffset = currentActive.offsetTop + currentActive.parentNode.clientHeight;
                    var sidebarHeight = sidebar.clientHeight;
                    // console.log(sidebarHeight+" sidebarHeight")
                    var currentActiveIsInView = (
                        currentActive.offsetTop >= sidebar.scrollTop &&
                        currentActiveOffset <= sidebar.scrollTop + sidebarHeight
                    )
                    var linkNotFurtherThanSidebarHeight = currentActiveOffset - currentPageOffset < sidebarHeight
                    var newScrollTop = currentActiveIsInView ? sidebar.scrollTop : linkNotFurtherThanSidebarHeight
                            ? currentPageOffset : currentActiveOffset - sidebarHeight
                    // console.log(newScrollTop+" newScrollTop")
                    sidebar.scrollTop = newScrollTop
                }
            }
        }

        function makeHeaderClickable(link) {
            var wrapper = document.createElement('a')
            wrapper.href = '#' + link.id
            wrapper.setAttribute('data-scroll', '')
            link.parentNode.insertBefore(wrapper, link)
            wrapper.appendChild(link)
        }
        function imgPlus() {
            var content = document.querySelector('.content');
            var contentCard = document.querySelector('.fix-sidebar');
            var imgs = content.querySelectorAll('img');
            var docs = document.querySelector('.docs');
            if(imgs.length){
                imgs.forEach(function (f) {
                    f.addEventListener('click',function (e) {
                        docs.style.overflow = 'hidden';
                        var img = document.createElement('img');
                        var span = document.createElement('span');
                        var div = document.createElement('div');
                        img.src= e.target.src;
                        div.appendChild(img);
                        var inner;
                        if(document.querySelector('.big-mask')){
                            inner = document.querySelector('.big-mask');
                            inner.style.display = 'flex'
                        }
                        else {
                            inner = document.createElement('div');
                        }

                        inner.className= 'big-mask';
                        div.appendChild(span);
                        inner.appendChild(div);
                        contentCard.appendChild(inner);
                        inner.addEventListener('click',function () {
                            if(inner){
                                inner.innerHTML = '';
                                inner.style.display = 'none';
                                docs.style.overflow= 'auto';
                                e.preventDefault()
                            }
                        });
                        img.addEventListener('click',function (e) {
                            e.stopPropagation()
                        });
                        span.addEventListener('click',function () {
                            if(inner){
                                inner.innerHTML = '';
                                inner.style.display = 'none';
                                docs.style.overflow= 'auto';
                            }
                        });
                    })
                })
            }
        }
        imgPlus()
    }
})()
