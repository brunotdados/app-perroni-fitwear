import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Calendar, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ManualProductForm } from "./ManualProductForm";
import { ProductImport } from "./ProductImport";
import { ProductTable } from "./ProductTable";

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
  sexo: "Feminino" | "Masculino" | "";
  faixaEtaria: string;
  custo: number;
}

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isSaved, setIsSaved] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleAddProduct = (product: Product) => {
    setProducts((prev) => [...prev, product]);
    setIsSaved(false);
  };

  const handleImportProducts = (importedProducts: Product[]) => {
    setProducts((prev) => [...prev, ...importedProducts]);
    setIsSaved(false);
  };

  const handleSaveProducts = async () => {
    setIsSaved(false);
    setIsSending(true);

    const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL as string | undefined;
    const TOKEN = import.meta.env.VITE_N8N_TOKEN as string | undefined;

    if (!WEBHOOK_URL) {
      setIsSending(false);
      toast({
        title: "Falha ao enviar",
        description: "URL do webhook não configurada (VITE_N8N_WEBHOOK_URL).",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      origem: "perroni-fitwear-app",
      enviadoEm: new Date().toISOString(),
      produtos: products,
    };

    try {
      const resp = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!resp.ok) {
        const texto = await resp.text();
        throw new Error(`HTTP ${resp.status} - ${texto}`);
      }

      setIsSaved(true);
      toast({
        title: "Produtos enviados!",
        description: `${products.length} produto(s) foram enviados ao fluxo do n8n.`,
      });
    } catch (err: any) {
      toast({
        title: "Erro ao enviar ao n8n",
        description: String(err?.message ?? err),
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  // 🔽 o return precisa estar DENTRO do componente
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Cadastro de Produtos
          </h1>
          <p className="text-muted-foreground">Perroni Fitwear</p>
        </div>
      </div>

      <ManualProductForm onAddProduct={handleAddProduct} />
      <ProductImport onImportProducts={handleImportProducts} />

      {products.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-secondary" />
                  Produtos Cadastrados
                </CardTitle>
                <CardDescription>{products.length} produtos no catálogo</CardDescription>
              </div>

              <Button
                onClick={handleSaveProducts}
                disabled={isSending || isSaved || products.length === 0}
                className="bg-gradient-secondary hover:shadow-glow transition-all duration-300"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSending ? "Enviando..." : isSaved ? "Salvo!" : "Salvar no Banco"}
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <ProductTable products={products} />

            {isSaved && (
              <div className="mt-4 flex items-center gap-2 text-success">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  Salvo em: {new Date().toLocaleString("pt-BR")}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
