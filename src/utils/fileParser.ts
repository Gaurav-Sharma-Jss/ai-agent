import { TrainingExample } from '../types/agent';

export async function parseTrainingFile(file: File): Promise<TrainingExample[]> {
  const text = await file.text();
  const examples: TrainingExample[] = [];

  try {
    if (file.name.endsWith('.json')) {
      return parseJsonFormat(text);
    } else if (file.name.endsWith('.csv')) {
      return parseCsvFormat(text);
    } else {
      return parseTextFormat(text);
    }
  } catch (error) {
    console.error('Error parsing file:', error);
    throw new Error('Failed to parse file. Please check the format and try again.');
  }
}

function parseJsonFormat(text: string): TrainingExample[] {
  const data = JSON.parse(text);
  if (!Array.isArray(data)) {
    throw new Error('JSON file must contain an array of examples');
  }

  return data.map((item, index) => {
    if (!item.input || !item.output) {
      throw new Error(`Invalid format at example ${index + 1}`);
    }
    return {
      input: item.input,
      output: item.output,
      category: item.category || 'custom'
    };
  });
}

function parseCsvFormat(text: string): TrainingExample[] {
  const lines = text.split('\n').filter(line => line.trim());
  const examples: TrainingExample[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const [input, output, category = 'custom'] = line.split(',').map(field => 
      field.trim().replace(/(^"|"$)/g, '')
    );

    if (!input || !output) {
      throw new Error(`Invalid format at line ${i + 1}`);
    }

    examples.push({ input, output, category });
  }

  return examples;
}

function parseTextFormat(text: string): TrainingExample[] {
  const examples: TrainingExample[] = [];
  const blocks = text.split('\n\n').filter(block => block.trim());

  for (const block of blocks) {
    const lines = block.split('\n').filter(line => line.trim());
    let input = '';
    let output = '';

    for (const line of lines) {
      if (line.startsWith('User:')) {
        input = line.replace('User:', '').trim();
      } else if (line.startsWith('Assistant:')) {
        output = line.replace('Assistant:', '').trim();
      }
    }

    if (input && output) {
      examples.push({ input, output, category: 'custom' });
    }
  }

  return examples;
}