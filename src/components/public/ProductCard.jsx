import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ProductCard({ product }) {
  return (
    <Card className="overflow-hidden">
      <img 
        src={product.image} 
        alt={product.name} 
        className="h-48 w-full object-cover"
      />
      <CardHeader>
        <div className="text-xs text-muted-foreground uppercase">{product.category}</div>
        <CardTitle className="text-lg">{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        <div className="mt-2 font-bold text-primary">
          Rp {product.price.toLocaleString("id-ID")}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Lihat Detail</Button>
      </CardFooter>
    </Card>
  );
}