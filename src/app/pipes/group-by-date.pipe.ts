import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'groupByDate',
  standalone: true,
  pure: false,
})
export class GroupByDatePipe implements PipeTransform {
  transform(value: any[]) {
    if (!value) return [];
    
    const groupedElements: { [key: string]: any[] } = {};

    value.forEach((obj: any) => {
      let dateValue = new Date(obj.date).toISOString().split('T')[0];

      if (!groupedElements[dateValue]) {
        groupedElements[dateValue] = [];
      }
      groupedElements[dateValue].push(obj);
    });

    return Object.keys(groupedElements).map((key) => ({
      date: key,
      items: groupedElements[key],
    }));
  }
}