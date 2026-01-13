function OrcamentoBaseForm({ form, setForm }) {
  return (
    <>
      <input
        placeholder="Título do orçamento"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        placeholder="Descrição"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
    </>
  );
}

export default OrcamentoBaseForm;
