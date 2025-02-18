import { CardContent, CardHeader, CardTitle } from '@tutur3u/ui/card';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';

interface TestCasesProps {
  results: { passed: boolean; message: string }[];
  isLoading: boolean;
}

export function TestCases({ results, isLoading }: TestCasesProps) {
  return (
    <>
      <CardHeader>
        <CardTitle>Test Cases</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : results.length === 0 ? (
          <p className="flex h-40 items-center justify-center text-center text-muted-foreground">
            Run your code to see the test results here.
          </p>
        ) : (
          <ul className="space-y-2">
            {results.map((result, index) => (
              <li
                key={index}
                className="flex items-start space-x-2 rounded-md bg-muted p-2"
              >
                {result.passed ? (
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                ) : (
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
                )}
                <span>{result.message}</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </>
  );
}
