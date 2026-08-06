const IgazolasKeres = () => {
  return (
    <div className="flex min-h-[100vh] min-w-full flex-col items-center justify-center bg-primaryLight px-2 pb-6 pt-[100px] text-black md:px-10 md:pb-10">
      <span className="text-4xl text-white md:text-7xl">Igazolás kérése</span>
      <div className="flex h-fit w-full flex-col space-y-6 p-6 md:w-[600px]">
        <div className="h-14 w-full">
          <input
            className="h-full w-full rounded-xl bg-lightGray p-4"
            placeholder="Email"
          />
        </div>
        <div className="h-14 w-full">
          <input
            className="h-full w-full rounded-xl bg-lightGray p-4"
            placeholder="Szekció"
          />
        </div>
        <div className="h-14 w-full">
          <input
            className="h-full w-full rounded-xl bg-lightGray p-4"
            placeholder="Év amikor résztvettél"
          />
        </div>
        <div className="h-48 w-full">
          <textarea
            className="h-full w-full rounded-xl bg-lightGray p-4"
            placeholder="Üzenet"
          />
        </div>
      </div>
    </div>
  );
};

export default IgazolasKeres;
