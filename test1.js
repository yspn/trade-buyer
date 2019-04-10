var getElementLeft = function(e) {
    for (var t = e.offsetLeft, n = e.offsetParent; null !== n; )
        t += n.offsetLeft,
        n = n.offsetParent;
    return t
}
var getElementTop = function(e) {
    for (var t = e.offsetTop, n = e.offsetParent; null !== n; )
        t += n.offsetTop,
        n = n.offsetParent;
    return t
}
var calcSessionId = function(e) {
    return parseInt(e.offsetWidth + "a" + e.offsetHeight + "a" + getElementLeft(e) + "a" + getElementTop(e), 11).toString(16)
}

calcSessionId(document.getElementById("nc_1_n1t"))
// "5e701e77d00d"

// win._n = "115#1r4yBf1O1TZLl1rfGCFm1CsoE51GBaFt1g4phZDwy5nlVkC1fxZ+1Zruv11CI+GUhaU8jxV2aTC9yzEQjDAkeKT8ukNQiQWWhEz4OkNcZLpAHirSpIfyeK1GzWNQiQXRUWzbvBNDaGwfyW/8pU2deKg8ykNQiFMJhUU4AWNcaB6fyzFQgSckTRDv5Fh8kcX8HHc9N/okKbQNr6R0e4lv1wwlhGwDiSV3tPPG5uBgw/VNoSnU5/4UHCTT3vYSRy5chaZCMK8bd7OC//tERMrxITE46sfEPt7XN/iyg9sUqp9DhlS4wURtBNZPDBidnwllwZkhE7LyvQnJrB1lpQPq0goZQ5r45X+IMAfJrs5DNLAFRtNUNXk+k1POTSMu4t1HBx2mpy6oK5rdlMcmwDodU5FaA9hzkDSmiNwxc0rAlin94SEfyzDBkl5yjBl86KKZ3Fe71qRqNC8jble7kUOKUVmjaTjvapoVrx7jxVtsFiUS1+N17HzzGV1/Yv5hx/M3YfAGo54nmf11d0LLx8ZdC5UHgof5z/TzOzDJo+OEF0+ReNqdpofO7NCHxFVLR+4vDFYIkieu/SChX8/pCW9ck5bQtEmWflKdDUkpEUqCCDvSPHb0wGZli20WZv6Y/XjWxGc51YLmSrX0FgNgfrri9bH7LgSSxxL23W+6nvFl2nJnDgOBCGU9RIQA1MpCgoffprKwXVpPnuLTwm+baOxGPCYowBQ87YFt0/W91peZmN4SghQVv5DGCnLkGhefb8Aw5XuktK8JRomnPr+3JqbOHDnJ90hmwI2VR9Bt3tTvLYz3BjXFnkPrn23RnD7YWT9SNycY1Bz7MWyL2tNkMkdge1JM5PCsVmGcvYLWX+7mhYZJ/XYPgpMN/DrjRNBirrPTenQ13Y4NT45tGqQaVck959cs4vgb/+0GTnLPDpONYaiuiFVmRE2ege24l07cva40Vupg3WYk2eZmf3n8b3/nxd//xpi7xPwcKRATNqB7Iii2ozGelQKwo4RXOEpiqvqFW60NVQbS4zAhe9V2pphThTS1Da12eKfps6FeTEtctob8i8VU/sDziKOwHQCvS19ez1RIpm441IWyHXC0upd3Ae6/GmIAQbU6YvWtZAS1JoEbZmB3oO/7E9cPvfgUKRyxXhWLkR4FinHN3izzWV5QuP64kYj64HvS7myF/0AFR9pj997QoQarOC6YvWdKd23CRMU0yDK0PKOhIb1lMqkcYrXx6pUpu5ZR15CODHxzGXqezW3Oh4RdwBi7oj2ZVb2Y7mREa8C9UT2oaOZFgy5lyRyBook52nmXT5W0n/AnhKXW0wFtuOuCBz6N9oiENziFKNsMWKa4Pf=="