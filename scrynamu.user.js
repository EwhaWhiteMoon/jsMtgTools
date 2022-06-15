// ==UserScript==
// @name         scryfall to namu
// @version      0.8
// @description  스크라이폴을 나무위키로
// @author       ygosuyasuya
// @match        https://scryfall.com/card/*/*/ko/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

/* global $ */

console.log("scryfall to namu loadded");

const multicolors = ["W", "U", "B", "R", "G", "WU", "UB", "BR", "RG", "GW", "WB", "UR", "BG", "RW", "GU", "GWU", "WUB", "UBR", "BRG", "RGW", "WBR", "URG", "BGW", "RWU", "GUB", "UBRG", "BRGW", "RGWU", "GWUB", "WUBR", "WUBRG"];

function multicolor_to_binary(colors){
    if(typeof colors === "string"){
        colors = [...colors];
    }

    return colors.reduce((acc, cur) => {
        return acc + Math.pow(2, ["W", "U", "B", "R", "G"].indexOf(cur));
    }, 0);
}

const multicolor_dic = multicolors.reduce((acc, cur) => {
    acc[multicolor_to_binary(cur)] = cur;
    return acc;
}, {});

function multicolor_sort(colors){
    return multicolor_dic[multicolor_to_binary(colors)];
}

function get_rarity_ko(rarity){
    const translate = {
        "common" : "커먼",
        "uncommon" : "언커먼",
        "rare" : "레어",
        "special" : "특별",
        "mythic" : "미식레어",
        "bonus" : "보너스",
    }
    return translate[rarity];
}

function get_set_name_ko(set, set_name){
    const translate = {
        "snc" : "뉴 카펜나의 거리",
        "neo" : "카미가와: 네온 왕조",
        "vow" : "이니스트라드: 핏빛 서약",
        "snc" : "뉴 카펜나의 거리",
        "mid" : "이니스트라드: 한밤의 거리",
        "afr" : "포가튼 렐름에서 펼쳐지는 모험",
        "stx" : "스트릭스헤이븐: 마법 학교",
        "sta" : "스트릭스헤이븐: 신비한 저장고",
        "khm" : "칼드하임",
        "znr" : "젠디카르 라이징",
        "m21" : "코어세트 2021",
        "iko" : "이코리아: 거대괴수들의 소굴",
        "thb" : "죽음 너머의 테로스",
        "eld" : "엘드레인의 왕좌",
        "m20" : "코어세트 2020",
        "war" : "플레인즈워커 전쟁",
        "rna" : "라브니카의 충성",
        "grn" : "라브니카의 길드",
        "m19" : "코어세트 2019",
        "dom" : "도미나리아",
        "rix" : "익살란의 숙적들",
        "xln" : "익살란",
        "hou": "파멸의 시간",
        "akh": "아몬케트",
        "aer": "에테르 봉기",
        "kld": "칼라데시",
        "mh1": "모던 호라이즌",
        "mh2": "모던 호라이즌 2",
    } // 여기 더 추가해야 함.
    if(typeof translate[set] === "string"){
        return translate[set];
    }else{
        return set_name;
    }
}

function get_color(colors, cost){
    const namu_color = {
        "W" : ["#fff", "#000"],
        "U" : ["#00f", "#fff"],
        "B" : ["#000", "#fff"],
        "R" : ["#f00", "#fff"],
        "G" : ["#0f0", "#000"],
    }
    let text = "";

    if(colors.length == 0){
        text = `
||<height=30px><:>'''마나비용'''||<:>${cost}||`;
    }else if(colors.length == 1){
        text = `
||<height=30px><:>'''마나비용'''||<:><${namu_color[colors[0]][0]}>{{{${namu_color[colors[0]][1]} ${cost} }}}||`;
    }else{
        const multicolor = [...multicolor_sort(colors)].map((color)=>namu_color[color][0]).join(",")
        text = `
||<height=30px><:>'''마나비용'''||<:>{{{#!wiki style="margin: -5px -10px; padding: 5px 10px; background-image: linear-gradient(to right, ${multicolor})"
{{{#fff ${cost} }}}}}}||`;
    }

    return text;
}

function parse_namu(card_data){
    let text = "";

    let line = 4;
    if(card_data.mana_cost !== ""){
        line ++;
    }
    if(card_data.printed_type_line.search("생물") != -1){
        line ++;
    }

    text += `||<height=30px><tablewidth=100%><width=150px><:>'''영어판 명칭'''||<:>'''${card_data.name}'''||<width=223px><|${line}>[[파일:${card_data.printed_name}_${card_data.set}.png]]||
||<height=30px><:>'''한글판 명칭'''||<:>'''${card_data.printed_name}'''||`;
    if(card_data.mana_cost !== ""){
        console.log(card_data.colors);
        text += get_color(card_data.colors,card_data.mana_cost);
    }
    let printed_text = card_data.printed_type_line.search("플레인즈워커") != -1 ? card_data.printed_text.replaceAll("\n", "\n-----\n") : card_data.printed_text.replaceAll("\n", "[br][br]");
    printed_text = printed_text.replaceAll("(", "''(").replaceAll(")", ")''");
    text += `
||<height=30px><:>'''[[매직 더 개더링/유형|유형]]'''||<:>${card_data.printed_type_line}||
||<-2>${printed_text}`;
    if(typeof card_data.flavor_text !== "string"){
        text += `||`;
    }else{
        text += `
-----
''${card_data.flavor_text.replaceAll("\n", "[br][br]")}''||`;
    }
    if(card_data.printed_type_line.search("생물") != -1){
        text += `
||<height=30px><:>'''공격력/방어력'''||<:>${card_data.power}/${card_data.toughness}||`;
    }
    text += `
||<:><-2>'''[[매직 더 개더링/블록|수록세트]]'''||<:>'''희귀도'''||
||<:><-2>[[${get_set_name_ko(card_data.set, card_data.set_name)}]]||<:>${get_rarity_ko(card_data.rarity)}||`;
    navigator.clipboard.writeText(text);
    alert("데이터가 클립보드에 복사되었습니다.");
}

$(".card-text-title").append("<button id='make_namu' class='print-langs-item current'>나무!</button>");
$("#make_namu").click(() => {
    const api_url = "https://api.scryfall.com/cards/" + window.location.pathname.split("/").slice(2, -1).join("/");

    $.ajax({
        type : "GET",
        url : api_url,
        contentType : "application/json; charset=utf-8",
        dataType : "json",
        success : res => parse_namu(res),
        failure : res => alert(res)
    });
});
