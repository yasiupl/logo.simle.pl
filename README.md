Kreator Logo SimLEProjekt narzędzia do tworzenia sygnetów i logotypów w stylu marki SimLE, oparty na technologii React oraz TypeScript.Wymagania wstępneAby uruchomić projekt, upewnij się, że masz zainstalowane na swoim komputerze:Node.js (wersja 18 lub nowsza).npm (dołączony do Node.js) lub yarn.Przygotowanie środowiskaSklonuj repozytorium (lub pobierz pliki projektu).Zainstaluj zależności:Otwórz terminal w folderze projektu i wpisz:npm install
Uruchom projekt w trybie deweloperskim:npm run dev
Aplikacja będzie dostępna pod adresem http://localhost:5173 (lub innym wskazanym w terminalu).Użycie plików .tsxTwój główny plik App.tsx jest punktem wejścia komponentu. Aby poprawnie korzystać z TypeScript w React:Typowanie: TypeScript wymusza określenie typów dla stanów i propsów. Przykład:interface AppProps {
  initialColor?: string;
}
const App: React.FC<AppProps> = ({ initialColor = '#000' }) => { ... }
Struktura: Upewnij się, że w pliku index.html lub main.tsx znajduje się odpowiedni punkt montowania:const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
FunkcjonalnościInteraktywna siatka: Możliwość malowania trójkątów.Zarządzanie kolorami: Wybór koloru przewodniego i tworzenie własnej palety.Wizualizacja na żywo: Automatyczne renderowanie sygnetu i tekstu z użyciem Science Gothic.Eksport: Możliwość pobierania projektów jako pliki .svg.Budowanie aplikacji (dla produkcji)Aby wygenerować zoptymalizowaną wersję aplikacji do umieszczenia na serwerze:npm run build
