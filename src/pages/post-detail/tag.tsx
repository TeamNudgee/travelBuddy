export const Tag = (props: { title: string }) => {
  return (
    <div
      className={'bg-blue-100 rounded-md px-2 py-1 text-xs text-blue-500 border border-blue-200'}
    >
      #{props.title}
    </div>
  );
};
