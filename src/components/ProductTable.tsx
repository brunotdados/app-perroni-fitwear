import React from "react";


interface ProductVariation {
  nome: string;
  valor: string;
}

interface Product {
  _localId?: string;
  id?: string;
  identificadorUrl: string;
  nome: string;
  categoria: string;
  variacoes: ProductVariation[];
  preco: number;
  precoPromocao: number;
  peso: number;
  altura: number;
  largura: number;
  comprimento: number;
  estoque: number;
  sku: string;
  codigoBarras: string;
  exibirLoja: boolean;
  freteGratis: boolean;
  descricao: string;
  tags: string;
  tituloSeo: string;
  descricaoSeo: string;
  marca: string;
  produtoFisico: boolean;
  mpn: string;
  sexo: "Feminino" | "Masculino" | "";
  faixaEtaria: string;
  custo: number;
}

type ProductTableProps = {
  products: Product[];
  selectable?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  getRowId?: (p: Product) => string;
};

export function ProductTable({
  products,
  selectable = false,
  selectedIds = new Set(),
  onToggleSelect,
  getRowId = (p) => (p as any)._localId ?? (p as any).sku,
}: ProductTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border">
        <thead>
          <tr className="text-left bg-muted">
            {selectable && <th className="w-28">Selecionar</th>}
            <th>SKU</th>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Preço</th>
            <th>Preço Promoção</th>
            <th>Estoque</th>
            <th>Código de Barras</th>
            <th>Identificador URL</th>
            <th>Marca</th>
            <th>Sexo</th>
            <th>Faixa Etária</th>
            <th>Custo</th>
            <th>Peso</th>
            <th>Altura</th>
            <th>Largura</th>
            <th>Comprimento</th>
            <th>Exibir na Loja</th>
            <th>Frete Grátis</th>
            <th>Produto Físico</th>
            <th>MPN</th>
            <th>Variações</th>
            <th>Descrição</th>
            <th>Tags</th>
            <th>Título SEO</th>
            <th>Descrição SEO</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const id = getRowId(p);
            const checked = selectedIds.has(id);

            return (
              <tr key={id} className="border-t">
                {selectable && (
                  <td>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggleSelect?.(id)}
                      title="Selecionar produto"
                    />
                  </td>
                )}
                <td>{p.sku}</td>
                <td>{p.nome}</td>
                <td>{p.categoria}</td>
                <td>{p.preco?.toFixed?.(2)}</td>
                <td>{p.precoPromocao?.toFixed?.(2)}</td>
                <td>{p.estoque}</td>
                <td>{p.codigoBarras}</td>
                <td>{p.identificadorUrl}</td>
                <td>{p.marca}</td>
                <td>{p.sexo}</td>
                <td>{p.faixaEtaria}</td>
                <td>{p.custo?.toFixed?.(2)}</td>
                <td>{p.peso}</td>
                <td>{p.altura}</td>
                <td>{p.largura}</td>
                <td>{p.comprimento}</td>
                <td>{p.exibirLoja ? "Sim" : "Não"}</td>
                <td>{p.freteGratis ? "Sim" : "Não"}</td>
                <td>{p.produtoFisico ? "Sim" : "Não"}</td>
                <td>{p.mpn}</td>
                <td>{p.variacoes?.map((v) => `${v.nome}: ${v.valor}`).join(", ")}</td>
                <td>{p.descricao}</td>
                <td>{p.tags}</td>
                <td>{p.tituloSeo}</td>
                <td>{p.descricaoSeo}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
