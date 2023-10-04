export default function ErrorPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full select-none items-center justify-center md:w-2/4 xl:w-2/5 2xl:w-2/6">
      <div className="text-center text-onBackground dark:text-dark-onBackground">
        <h1 className="mb-3">Authentifizieren fehlgeschlagen.</h1>
        <p>
          Nur{" "}
          <b className="text-primary dark:text-dark-primary">
            Administratoren haben Zugriff
          </b>{" "}
          auf dieses Dashboard. Wenn du denkst, dass du Zugriff haben solltest,
          versuche es später erneut!
        </p>
      </div>
    </div>
  );
}
