import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, Minus, UserPlus } from "lucide-react";

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

interface ManualProductFormProps {
  onAddProduct: (product: Product) => void;
}

export function ManualProductForm({ onAddProduct }: ManualProductFormProps) {
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'identificadorUrl' | 'sku' | 'precoPromocao'>>({
    nome: '',
    categoria: '',
    variacoes: [{ nome: '', valor: '' }],
    preco: 0,
    peso: 0,
    altura: 0,
    largura: 0,
    comprimento: 0,
    estoque: 0,
    codigoBarras: '',
    exibirLoja: true,
    freteGratis: false,
    descricao: '',
    tags: '',
    tituloSeo: '',
    descricaoSeo: '',
    marca: '',
    produtoFisico: true,
    mpn: '',
    sexo: '',
    faixaEtaria: '',
    custo: 0,
  });

  const fornecedorCodes: Record<string, string> = {
    "MFITMOOD": "MFT",
    "KELL FITNESS": "KELL",
    "JP FITNESS": "JP",
    "ARARA SPORT": "ARARA",
    "ATARA": "ATARA",
  };



  const generateIdentificadorUrl = (nome: string, categoria: string) => {
    return `${nome}-${categoria}`;
  };

  const generateSku = (categoria: string, nome: string, fornecedor: string) => {
    const prefix = fornecedorCodes[fornecedor] ?? fornecedor.slice(0, 3).toUpperCase();
    return `${prefix}-${categoria.toUpperCase()}-${nome.toUpperCase()}`;
  };


  const addVariation = () => {
    setFormData(prev => ({
      ...prev,
      variacoes: [...prev.variacoes, { nome: '', valor: '' }]
    }));
  };

  const removeVariation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      variacoes: prev.variacoes.filter((_, i) => i !== index)
    }));
  };

  const updateVariation = (index: number, field: 'nome' | 'valor', value: string) => {
    setFormData(prev => ({
      ...prev,
      variacoes: prev.variacoes.map((v, i) =>
        i === index ? { ...v, [field]: value } : v
      )
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const product: Product = {
      id: `prod_${Date.now()}`,
      ...formData,
      identificadorUrl: generateIdentificadorUrl(formData.nome, formData.categoria),
      sku: generateSku(formData.categoria, formData.nome, formData.marca),
      precoPromocao: formData.preco * 0.9,
    };

    onAddProduct(product);

    setFormData({
      nome: '',
      categoria: '',
      variacoes: [{ nome: '', valor: '' }],
      preco: 0,
      peso: 0,
      altura: 0,
      largura: 0,
      comprimento: 0,
      estoque: 0,
      codigoBarras: '',
      exibirLoja: true,
      freteGratis: false,
      descricao: '',
      tags: '',
      tituloSeo: '',
      descricaoSeo: '',
      marca: '',
      produtoFisico: true,
      mpn: '',
      sexo: '',
      faixaEtaria: '',
      custo: 0,
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-indigo-600" />
          Cadastro Manual de Produto
        </CardTitle>
        <CardDescription>
          Preencha os dados do produto para adicionar ao catálogo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Produto *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoria">Categoria *</Label>
              <Select
                value={formData.categoria ?? undefined}
                onValueChange={(value) =>
                  setFormData(prev => ({ ...prev, categoria: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Macaquinho">Macaquinho</SelectItem>
                  <SelectItem value="Macacão">Macacão</SelectItem>
                  <SelectItem value="Conjunto Shorts">Conjunto Shorts</SelectItem>
                  <SelectItem value="Conjunto Calça">Conjunto Calça</SelectItem>
                  <SelectItem value="Legging">Legging</SelectItem>
                  <SelectItem value="Shorts">Shorts</SelectItem>
                  <SelectItem value="Top">Top</SelectItem>
                  <SelectItem value="Camiseta">Camiseta</SelectItem>
                  <SelectItem value="Corta-Vento">Corta-Vento</SelectItem>
                </SelectContent>
              </Select>
            </div>


            <div className="space-y-2">
              <Label htmlFor="preco">Preço (R$) *</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                value={formData.preco}
                onChange={(e) => setFormData(prev => ({ ...prev, preco: parseFloat(e.target.value) || 0 }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="custo">Custo (R$)</Label>
              <Input
                id="custo"
                type="number"
                step="0.01"
                value={formData.custo}
                onChange={(e) => setFormData(prev => ({ ...prev, custo: parseFloat(e.target.value) || 0 }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estoque">Estoque</Label>
              <Input
                id="estoque"
                type="number"
                value={formData.estoque}
                onChange={(e) => setFormData(prev => ({ ...prev, estoque: parseInt(e.target.value) || 0 }))}
              />
            </div>

            {/* Fornecedor */}
            <div className="space-y-2">
              <Label htmlFor="fornecedor">Fornecedor *</Label>
              <Select
                value={formData.marca || undefined}
                onValueChange={(value) =>
                  setFormData(prev => ({ ...prev, marca: value })) // usando `marca` como fornecedor
                }
              >
                <SelectTrigger id="fornecedor">
                  <SelectValue placeholder="Selecione o fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MFITMOOD">MFITMOOD</SelectItem>
                  <SelectItem value="KELL FITNESS">KELL FITNESS</SelectItem>
                  <SelectItem value="JP FITNESS">JP FITNESS</SelectItem>
                  <SelectItem value="ARARA SPORT">ARARA SPORT</SelectItem>
                  <SelectItem value="ATARA">ATARA</SelectItem>
                </SelectContent>
              </Select>
            </div>


            <div className="space-y-2">
              <Label htmlFor="sexo">Sexo</Label>
              <Select
                value={formData.sexo}
                onValueChange={(value) =>
                  setFormData(prev => ({ ...prev, sexo: (value as 'Feminino' | 'Masculino') }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o sexo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Feminino">Feminino</SelectItem>
                  <SelectItem value="Masculino">Masculino</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="faixaEtaria">Faixa Etária</Label>
              <Input
                id="faixaEtaria"
                value={formData.faixaEtaria}
                onChange={(e) => setFormData(prev => ({ ...prev, faixaEtaria: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Variações do Produto</Label>
              <Button type="button" onClick={addVariation} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Variação
              </Button>
            </div>

            {formData.variacoes.map((variacao, index) => (
              <div key={index} className="flex gap-2 items-end">
                <div className="flex-1">
                  <Label htmlFor={`variacao-nome-${index}`}>Nome da Variação</Label>
                  <Input
                    id={`variacao-nome-${index}`}
                    placeholder="Ex: Cor, Tamanho"
                    value={variacao.nome}
                    onChange={(e) => updateVariation(index, 'nome', e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor={`variacao-valor-${index}`}>Valor da Variação</Label>
                  <Input
                    id={`variacao-valor-${index}`}
                    placeholder="Ex: Azul, M"
                    value={variacao.valor}
                    onChange={(e) => updateVariation(index, 'valor', e.target.value)}
                  />
                </div>
                {formData.variacoes.length > 1 && (
                  <Button type="button" onClick={() => removeVariation(index)} size="sm" variant="outline">
                    <Minus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="peso">Peso (kg)</Label>
              <Input
                id="peso"
                type="number"
                step="0.01"
                value={formData.peso}
                onChange={(e) => setFormData(prev => ({ ...prev, peso: parseFloat(e.target.value) || 0 }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="altura">Altura (cm)</Label>
              <Input
                id="altura"
                type="number"
                value={formData.altura}
                onChange={(e) => setFormData(prev => ({ ...prev, altura: parseFloat(e.target.value) || 0 }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="largura">Largura (cm)</Label>
              <Input
                id="largura"
                type="number"
                value={formData.largura}
                onChange={(e) => setFormData(prev => ({ ...prev, largura: parseFloat(e.target.value) || 0 }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="comprimento">Comprimento (cm)</Label>
              <Input
                id="comprimento"
                type="number"
                value={formData.comprimento}
                onChange={(e) => setFormData(prev => ({ ...prev, comprimento: parseFloat(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="codigoBarras">Código de Barras</Label>
              <Input
                id="codigoBarras"
                value={formData.codigoBarras}
                onChange={(e) => setFormData(prev => ({ ...prev, codigoBarras: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mpn">MPN</Label>
              <Input
                id="mpn"
                value={formData.mpn}
                onChange={(e) => setFormData(prev => ({ ...prev, mpn: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="exibirLoja"
                checked={formData.exibirLoja}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, exibirLoja: checked }))}
              />
              <Label htmlFor="exibirLoja">Exibir na Loja</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="freteGratis"
                checked={formData.freteGratis}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, freteGratis: checked }))}
              />
              <Label htmlFor="freteGratis">Frete Grátis</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="produtoFisico"
                checked={formData.produtoFisico}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, produtoFisico: checked }))}
              />
              <Label htmlFor="produtoFisico">Produto Físico</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição do Produto</Label>
            <Textarea
              id="descricao"
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tituloSeo">Título para SEO</Label>
              <Input
                id="tituloSeo"
                value={formData.tituloSeo}
                onChange={(e) => setFormData(prev => ({ ...prev, tituloSeo: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descricaoSeo">Descrição para SEO</Label>
              <Textarea
                id="descricaoSeo"
                value={formData.descricaoSeo}
                onChange={(e) => setFormData(prev => ({ ...prev, descricaoSeo: e.target.value }))}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="fitness, roupa, esporte, academia"
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            Adicionar Produto
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
