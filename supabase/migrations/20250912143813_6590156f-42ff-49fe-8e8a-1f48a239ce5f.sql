-- Create notes table
CREATE TABLE public.notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID NOT NULL,
  is_archived BOOLEAN DEFAULT false
);

-- Create documents table
CREATE TABLE public.documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  document_type TEXT NOT NULL,
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  expiry_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID NOT NULL,
  is_archived BOOLEAN DEFAULT false
);

-- Create market items table
CREATE TABLE public.market_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit TEXT DEFAULT 'un',
  price DECIMAL(10,2),
  category TEXT,
  is_purchased BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID NOT NULL,
  purchase_date TIMESTAMP WITH TIME ZONE
);

-- Create travel table
CREATE TABLE public.travels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  destination TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  budget DECIMAL(10,2),
  spent_amount DECIMAL(10,2) DEFAULT 0,
  status TEXT DEFAULT 'planned',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_id UUID NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travels ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for shared data (both users can see everything)
-- Notes policies
CREATE POLICY "Anyone can view notes" ON public.notes FOR SELECT USING (true);
CREATE POLICY "Anyone can insert notes" ON public.notes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update notes" ON public.notes FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete notes" ON public.notes FOR DELETE USING (true);

-- Documents policies
CREATE POLICY "Anyone can view documents" ON public.documents FOR SELECT USING (true);
CREATE POLICY "Anyone can insert documents" ON public.documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update documents" ON public.documents FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete documents" ON public.documents FOR DELETE USING (true);

-- Market items policies
CREATE POLICY "Anyone can view market items" ON public.market_items FOR SELECT USING (true);
CREATE POLICY "Anyone can insert market items" ON public.market_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update market items" ON public.market_items FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete market items" ON public.market_items FOR DELETE USING (true);

-- Travel policies
CREATE POLICY "Anyone can view travels" ON public.travels FOR SELECT USING (true);
CREATE POLICY "Anyone can insert travels" ON public.travels FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update travels" ON public.travels FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete travels" ON public.travels FOR DELETE USING (true);

-- Add triggers for updated_at
CREATE TRIGGER update_notes_updated_at
BEFORE UPDATE ON public.notes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
BEFORE UPDATE ON public.documents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_market_items_updated_at
BEFORE UPDATE ON public.market_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_travels_updated_at
BEFORE UPDATE ON public.travels
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for all tables
ALTER TABLE public.notes REPLICA IDENTITY FULL;
ALTER TABLE public.documents REPLICA IDENTITY FULL;
ALTER TABLE public.market_items REPLICA IDENTITY FULL;
ALTER TABLE public.travels REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.notes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.documents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.market_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.travels;