import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ProductVariation {
  nome: string;
  valor: string;
}

interface Product {
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
  sexo: 'Feminino' | 'Masculino' | '';
  faixaEtaria: string;
  custo: number;
}

interface ProductTableProps {
  products: Product[];
}

export function ProductTable({ products }: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum produto cadastrado ainda
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>identificadorUrl</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Variações</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Preço Promoção</TableHead>
            <TableHead>Estoque</TableHead>
            <TableHead>Marca</TableHead>
            <TableHead>Sexo</TableHead>
            <TableHead>Exibir Loja</TableHead>
            <TableHead>Frete Grátis</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={product.id || index}>
              <TableCell className="font-medium">{product.nome}</TableCell>
              <TableCell>{product.categoria}</TableCell>
              <TableCell className="font-mono text-sm">{product.sku}</TableCell>
              <TableCell>
                {product.variacoes.length > 0 ? (
                  <div className="space-y-1">
                    {product.variacoes.map((variacao, idx) => (
                      <div key={idx} className="text-xs">
                        <span className="font-medium">{variacao.nome}:</span> {variacao.valor}
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>R$ {product.preco.toFixed(2)}</TableCell>
              <TableCell className="text-green-600">R$ {product.precoPromocao.toFixed(2)}</TableCell>
              <TableCell>{product.estoque}</TableCell>
              <TableCell>{product.marca}</TableCell>
              <TableCell>{product.sexo || '-'}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${product.exibirLoja
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                  {product.exibirLoja ? 'SIM' : 'NÃO'}
                </span>
              </TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${product.freteGratis
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}>
                  {product.freteGratis ? 'SIM' : 'NÃO'}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}