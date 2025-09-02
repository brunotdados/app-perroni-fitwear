import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Save, Calendar, Package, Trash2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ManualProductForm } from "./ManualProductForm";
import { ProductImport } from "./ProductImport";
import { ProductTable } from "./ProductTable";

interface ProductVariation { nome: string; valor: string; }

interface Product {
  _localId?: string; // 👈 id local pra seleção
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

const genId = () =>
  (globalThis.crypto?.randomUUID?.() ?? `id_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`);

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set()); // 👈 selecionados para EXCLUIR
  const [isSaved, setIsSaved] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const withLocalId = (p: Product): Product => ({ _localId: p._localId ?? genId(), ...p });

  const handleAddProduct = (product: Product) => {
    setProducts(prev => [...prev, withLocalId(product)]);
    setIsSaved(false);
  };

  const handleImportProducts = (imported: Product[]) => {
    setProducts(prev => [...prev, ...imported.map(withLocalId)]);
    setIsSaved(false);
  };

  // ✅ marca/desmarca uma linha
  const handleToggleSelect = (localId: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(localId) ? next.delete(localId) : next.add(localId);
      return next;
    });
  };

  const handleClearSelection = () => setSelectedIds(new Set());

  // ✅ exclui as linhas selecionadas da lista
  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) {
      toast({ title: "Nada selecionado", description: "Marque ao menos 1 produto para excluir." });
      return;
    }
    if (!window.confirm(`Excluir ${selectedIds.size} produto(s) da lista?`)) return;

    setProducts(prev => prev.filter(p => !selectedIds.has(p._localId!)));
    setSelectedIds(new Set());
    setIsSaved(false);
    toast({ title: "Produtos removidos", description: "Itens selecionados foram excluídos da lista." });
  };

  const handleSaveProducts = async () => {
    setIsSaved(false);
    setIsSending(true);

    const WEBHOOK_URL = import.meta.env.VITE_N8N_WEBHOOK_URL as string | undefined;
    if (!WEBHOOK_URL) {
      setIsSending(false);
      toast({ title: "Falha ao enviar", description: "VITE_N8N_WEBHOOK_URL não definida no .env", variant: "destructive" });
      return;
    }

    if (products.length === 0) {
      setIsSending(false);
      toast({ title: "Nada para enviar", description: "Cadastre produtos antes de salvar.", variant: "destructive" });
      return;
    }

    const payload = {
      origem: "perroni-fitwear-app",
      enviadoEm: new Date().toISOString(),
      produtos: products.map(({ _localId, ...rest }) => rest), // _localId não vai para o n8n
    };

    try {
      const resp = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const text = await resp.text();
      if (!resp.ok) throw new Error(`HTTP ${resp.status} - ${text}`);

      setIsSaved(true);
      toast({
        title: "Produtos enviados!",
        description: `${products.length} produto(s) enviados ao n8n.`,
      });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Erro ao enviar ao n8n", description: String(err?.message ?? err), variant: "destructive" });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">Cadastro de Produtos</h1>
          <p className="text-muted-foreground">Perroni Fitwear</p>
        </div>
      </div>

      <ManualProductForm onAddProduct={handleAddProduct} />
      <ProductImport onImportProducts={handleImportProducts} />

      {products.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-secondary" /> Produtos Cadastrados
                </CardTitle>
                <CardDescription>
                  {products.length} produto(s) — {selectedIds.size} selecionado(s) para excluir
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleClearSelection} disabled={selectedIds.size === 0 || isSending}>
                  <XCircle className="w-4 h-4 mr-2" /> Limpar seleção
                </Button>
                <Button variant="destructive" onClick={handleDeleteSelected} disabled={selectedIds.size === 0 || isSending}>
                  <Trash2 className="w-4 h-4 mr-2" /> Excluir selecionados
                </Button>
                <Button
                  onClick={handleSaveProducts}
                  disabled={isSending || isSaved || products.length === 0}
                  className="bg-gradient-secondary hover:shadow-glow transition-all duration-300"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSending ? "Enviando..." : isSaved ? "Salvo!" : "Salvar no Banco"}
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <ProductTable
              products={products}
              selectable
              selectedIds={selectedIds}
              onToggleSelect={(id: string) => handleToggleSelect(id)}
              getRowId={(p: Product) => p._localId!}
            />

            {isSaved && (
              <div className="mt-4 flex items-center gap-2 text-success">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Salvo em: {new Date().toLocaleString("pt-BR")}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}