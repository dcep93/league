var _0x1b70=["\x75\x73\x65\x20\x73\x74\x72\x69\x63\x74","\x64\x61\x74\x61","\x61\x72\x67\x73","\x6E\x75\x6D\x43\x68\x61\x6D\x70\x73","\x6D\x61\x70","\x72\x65\x64\x54\x65\x61\x6D","\x63\x6F\x6E\x63\x61\x74","\x62\x6C\x75\x65\x54\x65\x61\x6D","\x6E\x65\x74\x77\x6F\x72\x6B\x73","\x64\x65\x70\x74\x68","\x72\x65\x73\x75\x6C\x74\x73","\x74\x65\x61\x6D","\x70\x75\x73\x68","\x73\x63\x6F\x72\x65","\x70\x6F\x70\x75\x6C\x61\x72\x69\x74\x79","\x6C\x65\x6E\x67\x74\x68","\x6F\x72\x64\x65\x72","\x73\x6F\x72\x74","\x70\x72\x75\x6E\x69\x6E\x67","\x66\x6C\x6F\x6F\x72","\x73\x6C\x69\x63\x65","\x70\x72\x6F\x67\x72\x65\x73\x73","\x73\x74\x61\x72\x74\x54\x69\x6D\x65","\x73\x70\x6C\x69\x63\x65","\x70\x6F\x70","\x69\x6E\x64\x65\x78\x4F\x66","\x62\x61\x6E\x73","\x62\x6C\x75\x65\x55\x73\x65\x72","\x73\x65\x6C\x66\x42\x61\x6E\x73","\x72\x61\x6E\x64\x6F\x6D","\x74\x61\x6E\x68","\x61\x74\x61\x6E\x68"];_0x1b70[0];onmessage= search;var memory=25;function search(_0xda84x3){var _0xda84x4=_0xda84x3[_0x1b70[1]];var _0xda84x5=_0xda84x4[_0x1b70[2]];var _0xda84x6=_0xda84x4[_0x1b70[7]][_0x1b70[6]](_0xda84x4[_0x1b70[5]][_0x1b70[4]](function(_0xda84x7){return _0xda84x7+ _0xda84x5[_0x1b70[3]]}));var _0xda84x8=searchHelper(_0xda84x6,_0xda84x4[_0x1b70[8]],_0xda84x5[_0x1b70[9]],_0xda84x5,true);var _0xda84x9=postResults(_0xda84x8,_0xda84x5[_0x1b70[3]]);postMessage({"\x74\x79\x70\x65":_0x1b70[10],"\x72\x65\x73\x75\x6C\x74\x73":_0xda84x9,"\x64\x61\x74\x61":_0xda84x4})}function postResults(_0xda84x8,_0xda84xb){var _0xda84x9=[];for(var _0xda84xc in _0xda84x8){var _0xda84xd=_0xda84x8[_0xda84xc];var _0xda84xe=[];var _0xda84xf=[];for(var _0xda84x10 in _0xda84xd[_0x1b70[11]]){var _0xda84x11=_0xda84xd[_0x1b70[11]][_0xda84x10];if(_0xda84x11< _0xda84xb){_0xda84xe[_0x1b70[12]](_0xda84x11)}else {_0xda84xf[_0x1b70[12]](_0xda84x11- _0xda84xb)}};var _0xda84xd={"\x62\x6C\x75\x65\x54\x65\x61\x6D":_0xda84xe,"\x72\x65\x64\x54\x65\x61\x6D":_0xda84xf,"\x73\x63\x6F\x72\x65":_0xda84xd[_0x1b70[13]],"\x70\x6F\x70\x75\x6C\x61\x72\x69\x74\x79":_0xda84xd[_0x1b70[14]]};_0xda84x9[_0x1b70[12]](_0xda84xd)};return _0xda84x9}function searchHelper(_0xda84x6,_0xda84x13,_0xda84x14,_0xda84x5,_0xda84x15){var _0xda84x16=1;var _0xda84x17=_0xda84x5[_0x1b70[16]][_0xda84x6[_0x1b70[15]]];while(_0xda84x14> _0xda84x16&& _0xda84x5[_0x1b70[16]][_0xda84x6[_0x1b70[15]]+ _0xda84x16]=== _0xda84x17){_0xda84x16+= 1};var _0xda84x18=_0xda84x14- _0xda84x16;var _0xda84x19=buildTeams(_0xda84x17,_0xda84x16,_0xda84x6,_0xda84x5);var _0xda84x1a=_0xda84x13[_0xda84x6[_0x1b70[15]]];var _0xda84x1b=multiScore(_0xda84x19,_0xda84x1a);_0xda84x1b[_0x1b70[17]](function(_0xda84x1c,_0xda84x1d){return (_0xda84x1d[_0x1b70[13]]- _0xda84x1c[_0x1b70[13]])* (_0xda84x17?1:-1)});_0xda84x1b= _0xda84x1b[_0x1b70[20]](0,Math[_0x1b70[19]]((1- _0xda84x5[_0x1b70[18]]/ 100)* _0xda84x1b[_0x1b70[15]]));var _0xda84x9=[];for(var _0xda84x7=0;_0xda84x7< _0xda84x1b[_0x1b70[15]];_0xda84x7++){if(_0xda84x15){postMessage({"\x74\x79\x70\x65":_0x1b70[21],"\x73\x74\x61\x72\x74\x54\x69\x6D\x65":_0xda84x5[_0x1b70[22]],"\x70\x72\x6F\x67\x72\x65\x73\x73":[_0xda84x7,_0xda84x1b[_0x1b70[15]]]})};if(_0xda84x18=== 0){handle(_0xda84x1b[_0xda84x7],_0xda84x9,_0xda84x17)}else {var _0xda84x1e=searchHelper(_0xda84x1b[_0xda84x7][_0x1b70[11]],_0xda84x13,_0xda84x18,_0xda84x5,false);for(var _0xda84xc in _0xda84x1e){var _0xda84xd=_0xda84x1e[_0xda84xc];handle(_0xda84xd,_0xda84x9,_0xda84x17)}}};return _0xda84x9}function betterScore(_0xda84x20,_0xda84x21,_0xda84x17){var _0xda84x22=_0xda84x17?1:-1;return (_0xda84x20* _0xda84x22)> (_0xda84x21* _0xda84x22)}function handle(_0xda84xd,_0xda84x9,_0xda84x17){if(_0xda84x9[_0x1b70[15]]> 0){if(betterScore(_0xda84xd[_0x1b70[13]],_0xda84x9[_0xda84x9[_0x1b70[15]]- 1][_0x1b70[13]],_0xda84x17)){var _0xda84x24=0;var _0xda84x25=_0xda84x9[_0x1b70[15]]- 1;while(_0xda84x25> _0xda84x24){var _0xda84x26=Math[_0x1b70[19]]((_0xda84x24+ _0xda84x25)/ 2);if(betterScore(_0xda84xd[_0x1b70[13]],_0xda84x9[_0xda84x26][_0x1b70[13]],_0xda84x17)){_0xda84x25= _0xda84x26}else {_0xda84x24= _0xda84x26+ 1}};_0xda84x9[_0x1b70[23]](_0xda84x24,0,_0xda84xd);if(_0xda84x9[_0x1b70[15]]> memory){_0xda84x9[_0x1b70[24]]()};return}};if(_0xda84x9[_0x1b70[15]]< memory){_0xda84x9[_0x1b70[12]](_0xda84xd)}}function canPickChamp(_0xda84x7,_0xda84x28,_0xda84x17,_0xda84x5){if((_0xda84x28[_0x1b70[25]](_0xda84x7)===  -1)&& _0xda84x28[_0x1b70[25]](_0xda84x7+ _0xda84x5[_0x1b70[3]])===  -1){if((_0xda84x5[_0x1b70[26]][_0x1b70[25]](_0xda84x7)===  -1)&& (_0xda84x5[_0x1b70[27]]!== _0xda84x17|| _0xda84x5[_0x1b70[28]][_0x1b70[25]](_0xda84x7)===  -1)){return true}};return false}function buildTeams(_0xda84x17,_0xda84x16,_0xda84x6,_0xda84x5){return buildTeamsHelper(_0xda84x17,_0xda84x16,_0xda84x6,_0xda84x5,[],0)}function buildTeamsHelper(_0xda84x17,_0xda84x16,_0xda84x6,_0xda84x5,_0xda84x2b,_0xda84x2c){var _0xda84x19=[];var _0xda84x2d;for(var _0xda84x7=_0xda84x2c;_0xda84x7<= _0xda84x5[_0x1b70[3]]- _0xda84x16;_0xda84x7++){if(canPickChamp(_0xda84x7,_0xda84x6,_0xda84x17,_0xda84x5)){_0xda84x2d= _0xda84x2b[_0x1b70[6]](_0xda84x17?_0xda84x7:_0xda84x7+ _0xda84x5[_0x1b70[3]]);if(_0xda84x16== 1){_0xda84x19[_0x1b70[12]](_0xda84x6[_0x1b70[6]](_0xda84x2d))}else {var _0xda84x2e=buildTeamsHelper(_0xda84x17,_0xda84x16- 1,_0xda84x6,_0xda84x5,_0xda84x2d,_0xda84x7+ 1);for(var _0xda84x2f in _0xda84x2e){_0xda84x19[_0x1b70[12]](_0xda84x2e[_0xda84x2f])}}}};return _0xda84x19}function multiScore(_0xda84x19,_0xda84x1a){function _0xda84x31(_0xda84x32){var _0xda84x33=Math[_0x1b70[29]]();if(_0xda84x32){var _0xda84x34=(2* _0xda84x33- 1)* Math[_0x1b70[30]](_0xda84x32);var _0xda84x35=Math[_0x1b70[31]](_0xda84x34)/ _0xda84x32;return (_0xda84x35+ 1)/ 2}else {return _0xda84x33}}var _0xda84x9=[];for(var _0xda84x2f in _0xda84x19){_0xda84x9[_0x1b70[12]]({"\x74\x65\x61\x6D":_0xda84x19[_0xda84x2f],"\x73\x63\x6F\x72\x65":_0xda84x31(25),"\x70\x6F\x70\x75\x6C\x61\x72\x69\x74\x79":_0xda84x31()})};return _0xda84x9}
