import tw from "twin.macro";

export type TableColumns<T> = {
  title?: string;
  key: string;
  render: (data: T, index: number) => JSX.Element;
};

export type TableProps<T = any> = {
  columns: TableColumns<T>[];
  data: T[];
};

export default function Table({ columns, data }: TableProps) {
  //** Columns */
  const colHeaders = columns.map(({ title, key }) => (
    <th tw="text-left py-5 text-sm" key={key}>
      {title?.toUpperCase()}
    </th>
  ));

  //** TableBody */
  const tabData = data.map((data, i) => {
    return (
      <tr
        key={`column${i}`}
        tw="border border-t-0 border-l-0 border-r-0 hover:(bg-gray-50)"
      >
        {columns.map(({ render }, i2) => (
          <td tw="py-4" key={`data${i}${i2}`}>
            {render(data, i)}
          </td>
        ))}
      </tr>
    );
  });

  return (
    <section tw="overflow-x-auto">
      <table tw="table-auto min-w-[48rem] w-full">
        <thead tw="border border-t-0 border-l-0 border-r-0">
          <tr>{colHeaders}</tr>
        </thead>
        <tbody tw="">{tabData}</tbody>
      </table>
    </section>
  );
}
