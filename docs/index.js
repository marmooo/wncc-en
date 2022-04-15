// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

const matchEscSqlRx = /[\0\b\t\n\r\x1a"'\\]/g;
function escapeSql(sqlStr) {
    const match = matchEscSqlRx.exec(sqlStr);
    if (!match) {
        return sqlStr;
    }
    let chunkIndex = matchEscSqlRx.lastIndex = 0;
    let escapedSqlStr = "";
    let matchChar;
    let escape;
    while(matchChar = matchEscSqlRx.exec(sqlStr)){
        switch(matchChar[0]){
            case "\0":
                escape = "\\0";
                break;
            case "\x08":
                escape = "\\b";
                break;
            case "\x09":
                escape = "\\t";
                break;
            case "\x1a":
                escape = "\\z";
                break;
            case "\n":
                escape = "\\n";
                break;
            case "\r":
                escape = "\\r";
                break;
            case '"':
            case "'":
            case "\\":
            case "%":
                escape = "\\" + matchChar[0];
                break;
            default:
                continue;
        }
        escapedSqlStr += sqlStr.slice(chunkIndex, matchChar.index) + escape;
        chunkIndex = matchEscSqlRx.lastIndex;
    }
    if (chunkIndex < sqlStr.length) {
        return "'" + escapedSqlStr + sqlStr.slice(chunkIndex) + "'";
    }
    return "'" + escapedSqlStr + "'";
}
!function(e, t) {
    if ("object" == typeof exports && "object" == typeof module) module.exports = t();
    else if ("function" == typeof define && define.amd) define([], t);
    else {
        var n = t();
        for(var r in n)("object" == typeof exports ? exports : e)[r] = n[r];
    }
}(this, function() {
    return (()=>{
        "use strict";
        var e1 = {
            870: (e2, t2, n2)=>{
                n2.r(t2), n2.d(t2, {
                    createEndpoint: ()=>o1
                    ,
                    expose: ()=>l1
                    ,
                    proxy: ()=>g
                    ,
                    proxyMarker: ()=>r1
                    ,
                    releaseProxy: ()=>a1
                    ,
                    transfer: ()=>y
                    ,
                    transferHandlers: ()=>c1
                    ,
                    windowEndpoint: ()=>v
                    ,
                    wrap: ()=>f1
                });
                const r1 = Symbol("Comlink.proxy"), o1 = Symbol("Comlink.endpoint"), a1 = Symbol("Comlink.releaseProxy"), s1 = Symbol("Comlink.thrown"), i1 = (e)=>"object" == typeof e && null !== e || "function" == typeof e
                , c1 = new Map([
                    [
                        "proxy",
                        {
                            canHandle: (e)=>i1(e) && e[r1]
                            ,
                            serialize (e) {
                                const { port1: t , port2: n  } = new MessageChannel;
                                return l1(e, t), [
                                    n,
                                    [
                                        n
                                    ]
                                ];
                            },
                            deserialize: (e)=>(e.start(), f1(e))
                        }
                    ],
                    [
                        "throw",
                        {
                            canHandle: (e)=>i1(e) && s1 in e
                            ,
                            serialize ({ value: e  }) {
                                let t;
                                return t = e instanceof Error ? {
                                    isError: !0,
                                    value: {
                                        message: e.message,
                                        name: e.name,
                                        stack: e.stack
                                    }
                                } : {
                                    isError: !1,
                                    value: e
                                }, [
                                    t,
                                    []
                                ];
                            },
                            deserialize (e) {
                                if (e.isError) throw Object.assign(new Error(e.value.message), e.value);
                                throw e.value;
                            }
                        }
                    ]
                ]);
                function l1(e3, t3 = self) {
                    t3.addEventListener("message", function n(r2) {
                        if (!r2 || !r2.data) return;
                        const { id: o , type: a , path: i  } = Object.assign({
                            path: []
                        }, r2.data), c = (r2.data.argumentList || []).map(w);
                        let f;
                        try {
                            const t4 = i.slice(0, -1).reduce((e, t)=>e[t]
                            , e3), n = i.reduce((e, t)=>e[t]
                            , e3);
                            switch(a){
                                case 0:
                                    f = n;
                                    break;
                                case 1:
                                    t4[i.slice(-1)[0]] = w(r2.data.value), f = !0;
                                    break;
                                case 2:
                                    f = n.apply(t4, c);
                                    break;
                                case 3:
                                    f = g(new n(...c));
                                    break;
                                case 4:
                                    {
                                        const { port1: t , port2: n  } = new MessageChannel;
                                        l1(e3, n), f = y(t, [
                                            t
                                        ]);
                                    }
                                    break;
                                case 5:
                                    f = void 0;
                            }
                        } catch (e4) {
                            f = {
                                value: e4,
                                [s1]: 0
                            };
                        }
                        Promise.resolve(f).catch((e)=>({
                                value: e,
                                [s1]: 0
                            })
                        ).then((e)=>{
                            const [r, s] = b(e);
                            t3.postMessage(Object.assign(Object.assign({}, r), {
                                id: o
                            }), s), 5 === a && (t3.removeEventListener("message", n), u(t3));
                        });
                    }), t3.start && t3.start();
                }
                function u(e5) {
                    (function(e) {
                        return "MessagePort" === e.constructor.name;
                    })(e5) && e5.close();
                }
                function f1(e, t) {
                    return d(e, [], t);
                }
                function p(e) {
                    if (e) throw new Error("Proxy has been released and is not useable");
                }
                function d(e6, t = [], n3 = function() {}) {
                    let r = !1;
                    const s2 = new Proxy(n3, {
                        get (n, o) {
                            if (p(r), o === a1) return ()=>E(e6, {
                                    type: 5,
                                    path: t.map((e)=>e.toString()
                                    )
                                }).then(()=>{
                                    u(e6), r = !0;
                                })
                            ;
                            if ("then" === o) {
                                if (0 === t.length) return {
                                    then: ()=>s2
                                };
                                const n = E(e6, {
                                    type: 0,
                                    path: t.map((e)=>e.toString()
                                    )
                                }).then(w);
                                return n.then.bind(n);
                            }
                            return d(e6, [
                                ...t,
                                o
                            ]);
                        },
                        set (n, o, a) {
                            p(r);
                            const [s, i] = b(a);
                            return E(e6, {
                                type: 1,
                                path: [
                                    ...t,
                                    o
                                ].map((e)=>e.toString()
                                ),
                                value: s
                            }, i).then(w);
                        },
                        apply (n, a, s) {
                            p(r);
                            const i = t[t.length - 1];
                            if (i === o1) return E(e6, {
                                type: 4
                            }).then(w);
                            if ("bind" === i) return d(e6, t.slice(0, -1));
                            const [c, l] = m(s);
                            return E(e6, {
                                type: 2,
                                path: t.map((e)=>e.toString()
                                ),
                                argumentList: c
                            }, l).then(w);
                        },
                        construct (n, o) {
                            p(r);
                            const [a, s] = m(o);
                            return E(e6, {
                                type: 3,
                                path: t.map((e)=>e.toString()
                                ),
                                argumentList: a
                            }, s).then(w);
                        }
                    });
                    return s2;
                }
                function m(e7) {
                    const t = e7.map(b);
                    return [
                        t.map((e)=>e[0]
                        ),
                        (n = t.map((e)=>e[1]
                        ), Array.prototype.concat.apply([], n))
                    ];
                    var n;
                }
                const h = new WeakMap;
                function y(e, t) {
                    return h.set(e, t), e;
                }
                function g(e) {
                    return Object.assign(e, {
                        [r1]: !0
                    });
                }
                function v(e, t6 = self, n = "*") {
                    return {
                        postMessage: (t, r)=>e.postMessage(t, n, r)
                        ,
                        addEventListener: t6.addEventListener.bind(t6),
                        removeEventListener: t6.removeEventListener.bind(t6)
                    };
                }
                function b(e) {
                    for (const [t, n] of c1)if (n.canHandle(e)) {
                        const [r, o] = n.serialize(e);
                        return [
                            {
                                type: 3,
                                name: t,
                                value: r
                            },
                            o
                        ];
                    }
                    return [
                        {
                            type: 0,
                            value: e
                        },
                        h.get(e) || []
                    ];
                }
                function w(e) {
                    switch(e.type){
                        case 3:
                            return c1.get(e.name).deserialize(e.value);
                        case 0:
                            return e.value;
                    }
                }
                function E(e, t7, n4) {
                    return new Promise((r)=>{
                        const o = new Array(4).fill(0).map(()=>Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(16)
                        ).join("-");
                        e.addEventListener("message", function t(n) {
                            n.data && n.data.id && n.data.id === o && (e.removeEventListener("message", t), r(n.data));
                        }), e.start && e.start(), e.postMessage(Object.assign({
                            id: o
                        }, t7), n4);
                    });
                }
            },
            162: function(e8, t8, n5) {
                var r3 = this && this.__createBinding || (Object.create ? function(e, t, n, r) {
                    void 0 === r && (r = n), Object.defineProperty(e, r, {
                        enumerable: !0,
                        get: function() {
                            return t[n];
                        }
                    });
                } : function(e, t, n, r) {
                    void 0 === r && (r = n), e[r] = t[n];
                }), o2 = this && this.__setModuleDefault || (Object.create ? function(e, t) {
                    Object.defineProperty(e, "default", {
                        enumerable: !0,
                        value: t
                    });
                } : function(e, t) {
                    e.default = t;
                }), a2 = this && this.__importStar || function(e) {
                    if (e && e.__esModule) return e;
                    var t = {};
                    if (null != e) for(var n in e)"default" !== n && Object.prototype.hasOwnProperty.call(e, n) && r3(t, e, n);
                    return o2(t, e), t;
                };
                Object.defineProperty(t8, "__esModule", {
                    value: !0
                }), t8.createDbWorker = void 0;
                const s = a2(n5(870));
                async function i(e) {
                    if (e.data && "eval" === e.data.action) {
                        const t = new Int32Array(e.data.notify, 0, 2), n = new Uint8Array(e.data.notify, 8);
                        let r;
                        try {
                            r = {
                                ok: await u(e.data.request)
                            };
                        } catch (t9) {
                            console.error("worker request error", e.data.request, t9), r = {
                                err: String(t9)
                            };
                        }
                        const o = (new TextEncoder).encode(JSON.stringify(r));
                        n.set(o, 0), t[1] = o.length, Atomics.notify(t, 0);
                    }
                }
                function c(e) {
                    if ("BODY" === e.tagName) return "body";
                    const t = [];
                    for(; e.parentElement && "BODY" !== e.tagName;){
                        if (e.id) {
                            t.unshift("#" + e.id);
                            break;
                        }
                        {
                            let n = 1, r = e;
                            for(; r.previousElementSibling;)r = r.previousElementSibling, n++;
                            t.unshift(e.tagName.toLowerCase() + ":nth-child(" + n + ")");
                        }
                        e = e.parentElement;
                    }
                    return t.join(" > ");
                }
                function l(e) {
                    return Object.keys(e);
                }
                async function u(e) {
                    if (console.log("dom vtable request", e), "select" === e.type) return [
                        ...document.querySelectorAll(e.selector)
                    ].map((t)=>{
                        const n = {};
                        for (const r of e.columns)"selector" === r ? n.selector = c(t) : "parent" === r ? t.parentElement && (n.parent = t.parentElement ? c(t.parentElement) : null) : "idx" === r || (n[r] = t[r]);
                        return n;
                    });
                    if ("insert" === e.type) {
                        if (!e.value.parent) throw Error('"parent" column must be set when inserting');
                        const t = document.querySelectorAll(e.value.parent);
                        if (0 === t.length) throw Error(`Parent element ${e.value.parent} could not be found`);
                        if (t.length > 1) throw Error(`Parent element ${e.value.parent} ambiguous (${t.length} results)`);
                        const n = t[0];
                        if (!e.value.tagName) throw Error("tagName must be set for inserting");
                        const r = document.createElement(e.value.tagName);
                        for (const t10 of l(e.value))if (null !== e.value[t10]) {
                            if ("tagName" === t10 || "parent" === t10) continue;
                            if ("idx" === t10 || "selector" === t10) throw Error(`${t10} can't be set`);
                            r[t10] = e.value[t10];
                        }
                        return n.appendChild(r), null;
                    }
                    if ("update" === e.type) {
                        const t = document.querySelector(e.value.selector);
                        if (!t) throw Error(`Element ${e.value.selector} not found!`);
                        const n = [];
                        for (const r of l(e.value)){
                            const o = e.value[r];
                            if ("parent" !== r) {
                                if ("idx" !== r && "selector" !== r && o !== t[r]) {
                                    if (console.log("SETTING ", r, t[r], "->", o), "tagName" === r) throw Error("can't change tagName");
                                    n.push(r);
                                }
                            } else if (o !== c(t.parentElement)) {
                                const e = document.querySelectorAll(o);
                                if (1 !== e.length) throw Error(`Invalid target parent: found ${e.length} matches`);
                                e[0].appendChild(t);
                            }
                        }
                        for (const r4 of n)t[r4] = e.value[r4];
                        return null;
                    }
                    throw Error(`unknown request ${e.type}`);
                }
                s.transferHandlers.set("WORKERSQLPROXIES", {
                    canHandle: (e)=>!1
                    ,
                    serialize (e) {
                        throw Error("no");
                    },
                    deserialize: (e)=>(e.start(), s.wrap(e))
                }), t8.createDbWorker = async function(e, t, n) {
                    const r = new Worker(t), o = s.wrap(r), a = await o.SplitFileHttpDatabase(n, e);
                    return r.addEventListener("message", i), {
                        db: a,
                        worker: o,
                        configs: e
                    };
                };
            },
            432: function(e9, t11, n6) {
                var r5 = this && this.__createBinding || (Object.create ? function(e, t, n, r) {
                    void 0 === r && (r = n), Object.defineProperty(e, r, {
                        enumerable: !0,
                        get: function() {
                            return t[n];
                        }
                    });
                } : function(e, t, n, r) {
                    void 0 === r && (r = n), e[r] = t[n];
                }), o = this && this.__exportStar || function(e, t) {
                    for(var n in e)"default" === n || Object.prototype.hasOwnProperty.call(t, n) || r5(t, e, n);
                };
                Object.defineProperty(t11, "__esModule", {
                    value: !0
                }), o(n6(162), t11);
            }
        }, t1 = {};
        function n1(r) {
            var o = t1[r];
            if (void 0 !== o) return o.exports;
            var a = t1[r] = {
                exports: {}
            };
            return e1[r].call(a.exports, a, a.exports, n1), a.exports;
        }
        return n1.d = (e, t)=>{
            for(var r in t)n1.o(t, r) && !n1.o(e, r) && Object.defineProperty(e, r, {
                enumerable: !0,
                get: t[r]
            });
        }, n1.o = (e, t)=>Object.prototype.hasOwnProperty.call(e, t)
        , n1.r = (e)=>{
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
                value: "Module"
            }), Object.defineProperty(e, "__esModule", {
                value: !0
            });
        }, n1(432);
    })();
});
function loadConfig() {
    if (localStorage.getItem("darkMode") == 1) {
        document.documentElement.dataset.theme = "dark";
    }
}
function toggleDarkMode() {
    if (localStorage.getItem("darkMode") == 1) {
        localStorage.setItem("darkMode", 0);
        delete document.documentElement.dataset.theme;
    } else {
        localStorage.setItem("darkMode", 1);
        document.documentElement.dataset.theme = "dark";
    }
}
function search() {
    const word = document.getElementById("searchText").value;
    searchCollocations(word);
}
function iosCopyToClipboard(el) {
    el = typeof el === "string" ? document.querySelector(el) : el;
    if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
        const editable = el.contentEditable;
        const readOnly = el.readOnly;
        el.contentEditable = true;
        el.readOnly = true;
        const range = document.createRange();
        range.selectNodeContents(el);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        el.setSelectionRange(0, 999999);
        el.contentEditable = editable;
        el.readOnly = readOnly;
    } else {
        el.select();
    }
    document.execCommand("copy");
}
function copyToClipboard(text) {
    const input = document.createElement("textarea");
    document.body.appendChild(input);
    input.value = text;
    iosCopyToClipboard(input);
    document.body.removeChild(input);
    alert("Copied to clipboard.");
}
async function searchCollocations(lemma) {
    const loading = document.getElementById("loading");
    loading.classList.remove("d-none");
    const obj = document.getElementById("collocations");
    const row = await dbWorker.db.query(`SELECT words FROM collocations WHERE lemma="${escapeSql(lemma)}"`);
    while(obj.firstChild){
        obj.removeChild(obj.firstChild);
    }
    if (row[0]) {
        const words = JSON.parse(row[0].words);
        for (const word of words){
            const button = document.createElement("button");
            button.className = "btn btn-outline-secondary m-1";
            button.textContent = word;
            button.onclick = ()=>{
                copyToClipboard(button.textContent);
            };
            obj.appendChild(button);
        }
    }
    loading.classList.add("d-none");
}
async function loadDBWorker() {
    const config = {
        from: "jsonconfig",
        configUrl: "/wncc-en/db/config.json"
    };
    dbWorker = await createDbWorker([
        config
    ], "/wncc-en/sql.js-httpvfs/sqlite.worker.js", "/wncc-en/sql.js-httpvfs/sql-wasm.wasm");
    searchCollocations("run");
}
let dbWorker;
loadConfig();
loadDBWorker();
document.addEventListener("keydown", function(event) {
    if (event.key == "Enter") {
        search();
    }
}, false);
document.getElementById("toggleDarkMode").onclick = toggleDarkMode;
document.getElementById("search").onclick = search;

