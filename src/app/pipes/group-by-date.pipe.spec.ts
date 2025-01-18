import { GroupByDatePipe } from './group-by-date.pipe';

describe('GroupByDatePipe', () => {

  // Check if an instance of a pipe can be created
  it('create an instance', () => {
    const pipe = new GroupByDatePipe();
    expect(pipe).toBeTruthy();
  });

  // Check if pipe correctly groups items by date
  it('should group items by date', () => {
    const pipe = new GroupByDatePipe();
    const input = [
      { name: 'City1', date: new Date('2023-01-01') },
      { name: 'City2', date: new Date('2023-01-01') },
      { name: 'City3', date: new Date('2023-01-02') },
    ];
    const result = pipe.transform(input);

    expect(result).toEqual([
      {
        date: '2023-01-01',
        items: [
          { name: 'City1', date: new Date('2023-01-01') },
          { name: 'City2', date: new Date('2023-01-01') },
        ],
      },
      {
        date: '2023-01-02',
        items: [{ name: 'City3', date: new Date('2023-01-02') }],
      },
    ]);
  });
});