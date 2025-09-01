import { useCallback, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileSpreadsheet, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

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

interface ProductImportProps {
  onImportProducts: (products: Product[]) => void;
}

export function ProductImport({ onImportProducts }: ProductImportProps) {
  const [fileName, setFileName] = useState<string>("");
  const [isImported, setIsImported] = useState(false);
  const { toast } = useToast();

  const generateIdentificadorUrl = (nome: string, categoria: string) => {
    if (!nome || !categoria) return '';
    return `${nome.toLowerCase().replace(/\s+/g, '-')}-${categoria.toLowerCase().replace(/\s+/g, '-')}`;
  };

  const generateSku = (categoria: string, nome: string) => {
    if (!categoria || !nome) return '';
    const fornecedor = 'PER'; // Perroni
    return `${fornecedor}-${categoria.substring(0, 3).toUpperCase()}-${nome.substring(0, 3).toUpperCase()}`;
  };

  const parseVariations = (variationString: string): ProductVariation[] => {
    if (!variationString) return [];
    
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(variationString);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // If not JSON, try to parse as simple string format
      const parts = variationString.split(',').map(v => v.trim());
      return parts.map(part => {
        const [nome, valor] = part.split(':').map(p => p.trim());
        return { nome: nome || '', valor: valor || part };
      });
    }
    
    return [];
  };

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        // Map the data to our Product interface - flexible column mapping
        const mappedProducts: Product[] = jsonData.map((row, index) => {
          const nome = row.nome || row.Nome || row.produto || row.Produto || row.name || row.Name || '';
          const categoria = row.categoria || row.Categoria || row.category || row.Category || '';
          
          const product: Product = {
            id: `prod_${Date.now()}_${index}`,
            identificadorUrl: row.identificadorUrl || row.identificador_url || generateIdentificadorUrl(nome, categoria),
            nome,
            categoria,
            variacoes: parseVariations(row.variacoes || row.variations || ''),
            preco: parseFloat(row.preco || row.Preco || row.price || row.Price || 0),
            precoPromocao: parseFloat(row.precoPromocao || row.preco_promocao || row.promotional_price || (parseFloat(row.preco || row.Preco || row.price || row.Price || 0) * 0.9)),
            peso: parseFloat(row.peso || row.weight || 0),
            altura: parseFloat(row.altura || row.height || 0),
            largura: parseFloat(row.largura || row.width || 0),
            comprimento: parseFloat(row.comprimento || row.length || 0),
            estoque: parseInt(row.estoque || row.Estoque || row.stock || row.Stock || 0),
            sku: row.sku || row.SKU || generateSku(categoria, nome),
            codigoBarras: row.codigoBarras || row.codigo_barras || row.barcode || '',
            exibirLoja: row.exibirLoja === 'SIM' || row.exibir_loja === 'SIM' || row.show_in_store === 'YES' || row.exibirLoja === true || true,
            freteGratis: row.freteGratis === 'SIM' || row.frete_gratis === 'SIM' || row.free_shipping === 'YES' || row.freteGratis === true || false,
            descricao: row.descricao || row.Descricao || row.description || row.Description || '',
            tags: row.tags || row.Tags || '',
            tituloSeo: row.tituloSeo || row.titulo_seo || row.seo_title || '',
            descricaoSeo: row.descricaoSeo || row.descricao_seo || row.seo_description || '',
            marca: row.marca || row.Marca || row.brand || row.Brand || 'Perroni Fitwear',
            produtoFisico: row.produtoFisico === 'SIM' || row.produto_fisico === 'SIM' || row.physical_product === 'YES' || row.produtoFisico === true || true,
            mpn: row.mpn || row.MPN || '',
            sexo: row.sexo || row.Sexo || row.gender || row.Gender || '',
            faixaEtaria: row.faixaEtaria || row.faixa_etaria || row.age_range || '',
            custo: parseFloat(row.custo || row.Custo || row.cost || row.Cost || 0),
          };

          return product;
        });

        onImportProducts(mappedProducts);
        setIsImported(true);

        toast({
          title: "Planilha importada com sucesso!",
          description: `${mappedProducts.length} produtos foram carregados.`,
        });
      } catch (error) {
        toast({
          title: "Erro ao importar planilha",
          description: "Verifique se o arquivo está no formato correto.",
          variant: "destructive",
        });
      }
    };

    reader.readAsArrayBuffer(file);
  }, [onImportProducts, toast]);

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-primary" />
          Importar Planilha
        </CardTitle>
        <CardDescription>
          Faça upload de uma planilha (.csv ou .xlsx) com os dados dos produtos
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="file-upload">Arquivo</Label>
          <Input
            id="file-upload"
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
          />
        </div>
        
        {fileName && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Arquivo: {fileName}</span>
            {isImported && <Check className="w-4 h-4 text-success" />}
          </div>
        )}

        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Colunas aceitas na planilha:</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong>Obrigatórias:</strong> nome, categoria, preco</p>
            <p><strong>Opcionais:</strong> variacoes, peso, altura, largura, comprimento, estoque, sku, codigoBarras, exibirLoja, freteGratis, descricao, tags, tituloSeo, descricaoSeo, marca, produtoFisico, mpn, sexo, faixaEtaria, custo</p>
            <p><strong>Nota:</strong> A importação aceita variações nos nomes das colunas (português/inglês, maiúscula/minúscula)</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}