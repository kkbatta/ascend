import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const fontOptions = [
  {
    name: 'Playfair Display',
    className: 'font-playfair',
    size: 'text-lg'
  },
  {
    name: 'Cormorant Garamond',
    className: 'font-cormorant',
    size: 'text-xl'
  },
  {
    name: 'Cinzel',
    className: 'font-cinzel',
    size: 'text-lg'
  },
  {
    name: 'Quicksand',
    className: 'font-quicksand',
    size: 'text-xl'
  },
  {
    name: 'Raleway',
    className: 'font-raleway',
    size: 'text-lg'
  }
];

export const FontPreview = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Tagline Font Preview</h1>
      <div className="grid gap-6">
        {fontOptions.map((font, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{font.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`${font.className} ${font.size} text-gray-600`}>
                Growing Stronger Together
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
