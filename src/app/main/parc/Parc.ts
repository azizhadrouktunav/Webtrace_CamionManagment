import { string } from '@amcharts/amcharts4/core';
import * as pako from 'pako';


export class Parc {
    public static SessionId: string = "";

   
     }

     
export function decrypt(compressedStr){
    let res = null;
    if (compressedStr != "") {
            let compressData = atob(compressedStr);
             let compressData1 = compressData.split('').map(function (e) {
                return e.charCodeAt(0);
            });
            let binData = new Uint8Array(compressData1);
            let decompreData = pako.inflate(binData, { to: 'string' });
            res = JSON.parse(decompreData);
        }
        return res;
}
export function crypt(data){
    let res = null;
    if (data != null) {
           // let compressData = atob(compressedStr);
           /*  let compressData1 = compressData.split('').map(function (e) {
                return e.charCodeAt(0);
            });*/
          //  let binData = new Uint8Array(compressData1);
          let datajson= JSON.stringify(data);
            let compreData = pako.gzip(datajson);
           // let binData = new Uint8Array(compreData);
           res=   btoa(new Uint8Array(compreData).reduce(function (data, byte) {
            return data + String.fromCharCode(byte);
        }, ''));
           // res =btoa(String.fromCharCode(... new Uint8Array(compreData))) ;
        }
        return res;
}



 

      