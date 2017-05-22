import { Injectable } from '@angular/core';
import * as XLSX from 'ts-xlsx';
import {saveAs} from 'file-saver';
import {ICell, IWritingOptions} from "xlsx";

@Injectable()
export class ExcelService {

  constructor() {
  }

  createExcelFromData(data, filename){
    return new Promise((resolve) => {
      let wb:XLSX.IWorkBook = {SheetNames: [], Sheets: {}, Props: {}};
      let ws:XLSX.IWorkSheet = {};
      let wsName: string = 'Time';
      let wopts:IWritingOptions = {bookType: "xlsx", type: "binary", bookSST: true, compression: true};

      var rowPos = -1;
      var currentDayNum: Number = 8;
      var totalHours  = 0;

      for (var i=0;i<data.length;i++){
        rowPos++;

        let currentDay = data[i];

        let currentDate = new Date(currentDay.$key);

        if (currentDate.getDay() <= currentDayNum){
          rowPos++;
          let dayString = currentDate.getDate()+this.getDaySuffix(currentDate.getDate())+' '+this.getMonthName(currentDate.getMonth());
          let dayCell:XLSX.IWorkSheetCell = {v: dayString, t: "s"};
          let dayCellRef = XLSX.utils.encode_cell({c: 0, r: rowPos});
          ws[dayCellRef] = dayCell;
        }
        currentDayNum = currentDate.getDay();

        let dayName = this.getDayName(currentDate.getDay());
        let dayNameCell:XLSX.IWorkSheetCell = {v: dayName, t: "s"};
        let dayNameCellRef = XLSX.utils.encode_cell({c: 1, r: rowPos});
        ws[dayNameCellRef] = dayNameCell;

        let timeLengthText = currentDay.missed == 1 ? currentDay.missReason : currentDay.startTime+" - "+currentDay.endTime;
        let timeLength:XLSX.IWorkSheetCell = {v: timeLengthText, t: "s"};
        let timeCellRef = XLSX.utils.encode_cell({c: 2, r: rowPos});
        ws[timeCellRef] = timeLength;

        let hoursCell:XLSX.IWorkSheetCell = {v: currentDay.missed == 1 ? 0 : currentDay.totalTime, t: "n"};
        let hoursCellRef = XLSX.utils.encode_cell({c: 3, r: rowPos});
        ws[hoursCellRef] = hoursCell;

        totalHours += Number(currentDay.totalTime);
      }

      rowPos += 2;

      let totalLabelCell:XLSX.IWorkSheetCell = {v: 'Total', t: "s"};
      let totalLabelCellRef = XLSX.utils.encode_cell({c: 2, r: rowPos});
      ws[totalLabelCellRef] = totalLabelCell;

      let totalHoursCell:XLSX.IWorkSheetCell = {v: String(totalHours), f: 'SUM(D1:D'+(rowPos-1)+')', t: "n"};
      let totalHoursCellRef = XLSX.utils.encode_cell({c: 3, r: rowPos});
      ws[totalHoursCellRef] = totalHoursCell;

      ws["!ref"] = "A1:D"+(rowPos+1);

      wb.SheetNames.push(wsName);

      wb.Sheets[wsName] = ws;

      let wbData = XLSX.write(wb, wopts);

      saveAs(new Blob([this.s2ab(wbData)],{type:"application/octet-stream"}), filename+".xlsx");
      resolve();
    });

  }

  getDaySuffix(dayNumber){
    switch (Number(dayNumber)) {
      case 1:
      case 21:
      case 31:
        return 'st';
      case 2:
      case 22:
        return 'nd';
      case 3:
      case 23:
        return 'rd';
      default:
        return 'th';
    }
  }

  getDayName(dayNumber){
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayNumber];
  }

  getMonthName(monthNumber){
    let months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    return months[monthNumber];
  }

  s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

}
