await import('./build-type-doc' + '.ts').then((m) =>
    m.buildTypeDoc(import.meta.dirname)
);
