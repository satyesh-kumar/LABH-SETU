import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  HelpCircle,
  Shield,
  FileCheck2,
  Lock,
  MessageSquare,
  Send,
  Star,
  CheckCircle2,
} from 'lucide-react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const HelpPage = () => {
  const { t } = useTranslation();
  const { success, error } = useToast();

  const [rating, setRating] = useState(5);
  const [wasUseful, setWasUseful] = useState(true);
  const [understandable, setUnderstandable] = useState(true);
  const [foundScheme, setFoundScheme] = useState(true);
  const [comments, setComments] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackDone, setFeedbackDone] = useState(false);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setSubmittingFeedback(true);
    try {
      const { data } = await api.post('/feedback', {
        rating,
        wasInformationUseful: wasUseful,
        wereQuestionsUnderstandable: understandable,
        foundSchemeLookingFor: foundScheme,
        comments,
      });

      if (data.success) {
        success('Thank you! Your feedback has been recorded.');
        setFeedbackDone(true);
      }
    } catch (err) {
      error(err.message || 'Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const faqs = [
    {
      q: 'Is LabhSetu an official government website?',
      a: 'LabhSetu is an AI-assisted public informational platform that aggregates, structures, and simplifies eligibility criteria and document readiness. For official submissions and final approvals, LabhSetu directs citizens to designated official ministry and state department portals.',
    },
    {
      q: 'How does the eligibility engine decide if I am eligible?',
      a: 'The engine uses deterministic, auditable rules based on published government norms (such as landholding, annual income limit, age, residence type, and social category). It never relies on probabilistic blackbox guesses for final screening decisions.',
    },
    {
      q: 'How does document OCR protect my personal data?',
      a: 'All document extractions run securely. Sensitive identity numbers like Aadhaar and PAN are automatically masked, and files are stored in access-controlled environments. Extracted information is always presented for citizen review and verification before saving.',
    },
    {
      q: 'What should I do after my documents show 100% readiness?',
      a: 'Once your document checklist is ready, click "Open Official Portal" in the application pathway. You will be directed to the official departmental registration page where you can submit the form and obtain your application receipt number.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Help Centre & Transparency Guidelines
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Everything you need to know about scheme eligibility, document security, and application guidance
        </p>
      </div>

      {/* Frequently Asked Questions */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-gov-600" />
          <span>Frequently Asked Questions</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, idx) => (
            <Card key={idx} className="p-5 border-slate-200 bg-white">
              <h4 className="text-sm font-bold text-slate-800 mb-2">{faq.q}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Data Privacy & Security Notice (Section 41 & 42) */}
      <Card id="privacy" className="p-6 sm:p-8 bg-slate-900 text-white border-slate-800">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-800 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white">Data Privacy & Security Standard</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              LabhSetu adheres strictly to data minimization and user consent. We never sell personal data or display unmasked Aadhaar numbers. You retain full control to view, edit, or delete uploaded documents and personal profile attributes at any time.
            </p>
          </div>
        </div>
      </Card>

      {/* Citizen Feedback Form (Section 48) */}
      <Card id="feedback" className="p-6 sm:p-8 border-slate-200 bg-white">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
          <MessageSquare className="w-5 h-5 text-gov-600" />
          <h3 className="text-base font-bold text-slate-900">Citizen Service Feedback</h3>
        </div>

        {feedbackDone ? (
          <div className="text-center py-8 space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-slate-900">Thank you for your feedback!</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your inputs help administrators refine eligibility questions and ensure reliable assistance for all citizens.
            </p>
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="space-y-5">
            {/* Star Rating */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Overall Experience Rating
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-amber-400 hover:text-amber-500 focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'fill-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 ml-2">
                  {rating} of 5 Stars
                </span>
              </div>
            </div>

            {/* Quick check questions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <label className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wasUseful}
                  onChange={(e) => setWasUseful(e.target.checked)}
                  className="rounded text-gov-600 focus:ring-gov-600 w-4 h-4"
                />
                <span className="text-slate-700 font-medium">Was information useful?</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={understandable}
                  onChange={(e) => setUnderstandable(e.target.checked)}
                  className="rounded text-gov-600 focus:ring-gov-600 w-4 h-4"
                />
                <span className="text-slate-700 font-medium">Questions understandable?</span>
              </label>

              <label className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={foundScheme}
                  onChange={(e) => setFoundScheme(e.target.checked)}
                  className="rounded text-gov-600 focus:ring-gov-600 w-4 h-4"
                />
                <span className="text-slate-700 font-medium">Found relevant schemes?</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Optional Suggestions or Comments
              </label>
              <textarea
                rows="3"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Share your experience or suggestions for improving scheme discovery..."
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-gov-600"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={Send}
              isLoading={submittingFeedback}
            >
              Submit Citizen Feedback
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};

export default HelpPage;
