import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Flag, AlertTriangle } from 'lucide-react';
import { t } from '@/lib/i18n';

interface ReportDialogProps {
  onReport: (reason: string, details?: string) => void;
  isReporting: boolean;
  children: React.ReactNode;
}

export function ReportDialog({ onReport, isReporting, children }: ReportDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');

  const reportReasons = [
    { value: 'spam', label: t('reportDialog.reason.spam') },
    { value: 'harassment', label: t('reportDialog.reason.harassment') },
    { value: 'hate', label: t('reportDialog.reason.hate') },
    { value: 'violence', label: t('reportDialog.reason.violence') },
    { value: 'misinformation', label: t('reportDialog.reason.misinformation') },
    { value: 'inappropriate', label: t('reportDialog.reason.inappropriate') },
    { value: 'copyright', label: t('reportDialog.reason.copyright') },
    { value: 'other', label: t('reportDialog.reason.other') },
  ];

  const handleReport = () => {
    if (!reason) {
      return;
    }
    
    onReport(reason, details);
    setIsOpen(false);
    setReason('');
    setDetails('');
  };

  const handleCancel = () => {
    setIsOpen(false);
    setReason('');
    setDetails('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span>{t('reportDialog.title')}</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-md p-3">
            <div className="flex items-start space-x-2">
              <Flag className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-orange-800 dark:text-orange-200">
                <p className="font-medium">{t('reportDialog.whyReporting')}</p>
                <p className="mt-1">{t('reportDialog.reportsHelp')}</p>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="reason">{t('reportDialog.reasonLabel')}</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder={t('reportDialog.reasonPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                {reportReasons.map((reportReason) => (
                  <SelectItem key={reportReason.value} value={reportReason.value}>
                    {reportReason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="details">{t('reportDialog.detailsLabel')}</Label>
            <Textarea
              id="details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder={t('reportDialog.detailsPlaceholder')}
              rows={3}
            />
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>
              {t('reportDialog.falseReportsWarning')}
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row space-y-2 sm:space-y-0">
          <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
            {t('reportDialog.cancelButton')}
          </Button>
          <Button 
            onClick={handleReport} 
            disabled={!reason || isReporting}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
          >
            {isReporting ? t('reportDialog.reportingButton') : t('reportDialog.submitButton')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}