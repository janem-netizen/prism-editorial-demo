import {templates,topics} from './data.js';
export const escapeHTML = s => String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function retrieve(topic, type, knowledge){
 const words=(topic+' '+type).toLowerCase().split(/\W+/).filter(w=>w.length>3);
 return knowledge.map(s=>({...s,match:s.tags.includes('all')?2:words.reduce((n,w)=>n+(s.tags.some(t=>t.includes(w)||w.includes(t))?3:0),0)})).filter(s=>s.match>0).sort((a,b)=>b.match-a.match);
}
export function makeBrief(record, knowledge){
 const t=templates.find(t=>t.id===record.type), selected=retrieve(record.title,record.type,knowledge);
 const ruleList=selected.filter(s=>['Brand','Rules','SEO','Audience'].includes(s.kind));
 return {sources:structuredClone(selected),text:`# ${record.title}\n\n## Direction\n${record.angle}\n\nAudience: ${record.audience}\nPrimary keyword: ${record.keyword}\nSearch intent: ${t.intent}\nTarget length: ${record.target} words\n\n## Outline\n${t.sections.map(s=>'- '+s).join('\n')}\n\n## Template requirements\n${t.rules.map(s=>'- '+s).join('\n')}\n\n## Context to apply\n${ruleList.map(s=>`### ${s.title}\n${s.text}`).join('\n\n')}\n\n## Evidence & research\n${selected.filter(s=>!ruleList.includes(s)).map(s=>`### ${s.title}\n${s.text}`).join('\n\n')}\n\n## Acceptance criteria\n- Answer the reader’s question early.\n- Use approved expert input and source context.\n- Keep factual claims traceable.\n- Do not invent metrics, quotes or customer results.\n- Complete human review before marking the article approved.\n\n## Demo research note\nThis brief uses the local context library. No live search, SEO API or external model was called.`};
}
export function addExpertToBrief(record){
 const base=record.brief.split('\n\n## Confirmed expert input')[0];
 record.brief=base+'\n\n## Confirmed expert input\n'+record.questions.map((q,i)=>`### ${q}\n${record.answers[i]}`).join('\n\n');
}
export function generateDraft(record){
 if(record.status!=='Ready to draft') throw new Error('Approve the brief before drafting.');
 const topic=topics.find(t=>t.id===record.topicId);
 if(!topic) throw new Error('Choose a prepared topic for this demo.');
 const expert=record.answers.map((a,i)=>`### ${record.questions[i]}\n${a}`).join('\n\n');
 const intro=record.type==='howto'?`A useful ${record.keyword} gives the team a repeatable way to make decisions. Start with a clear outcome, agree on the working rules and review a small example before expanding. This guide turns that approach into practical steps for ${record.audience}.`:`The right choice depends on the work your team needs to do and the process it can support. This comparison of ${record.keyword} starts with fit, visibility and trade-offs. All named options below are fictional examples created for this demonstration.`;
 let body=record.type==='howto'?`## What to prepare\nBring a clear target segment, a current example of the workflow and an owner who can decide what good looks like. A short working checklist is more useful than a large collection of disconnected notes.\n\n${topic.steps.map(([h,p,ex],i)=>`## ${i+1}. ${h}\n${p}\n\n**In practice:** ${ex}`).join('\n\n')}\n\n## Common mistakes\n- Expanding activity before the acceptance rules are clear.\n- Treating a team assumption as a confirmed buyer need.\n- Changing several parts of the process at once.\n- Losing the context behind a decision during the handoff.\n\n## Your next working session\nChoose one recent example. Walk through the process with the people doing the work and the person receiving its output. Write down the first ambiguity you find, agree on a rule and test it with the next example.`:
 `## How to assess the options\nStart with the task, then compare like-for-like options. Ask about specialist fit, delivery model, visibility, flexibility and trade-offs. Treat these as decision criteria, not a universal ranking.\n\n## At-a-glance comparison\n| Option | Category | Best fit | Visibility | Trade-off |\n| --- | --- | --- | --- | --- |\n${topic.options.map(row=>'| '+row.join(' | ')+' |').join('\n')}\n\n${topic.options.map(([name,cat,fit,visibility,trade])=>`## ${name}\n**Category:** ${cat}.\n\n**Best fit:** ${fit}. This option illustrates a distinct way to organize the work. Confirm that your internal owner can support the process before choosing it.\n\n**What to assess:** ${visibility}. Ask for a sample of what the team will see and use during a normal week.\n\n**Trade-off:** ${trade}. Decide whether this constraint is acceptable for your current stage.\n\n**Ask before choosing:** Who owns the decisions, what happens when context changes, and how is quality reviewed?`).join('\n\n')}\n\n## Make a decision with a realistic test\nUse the same sample task and acceptance criteria for every option. Review the output with the people who will use it. Choose the option whose process and limitations fit your team, and record why the alternatives were less suitable.`;
 return `# ${record.title}\n\n${intro}\n\n${body}\n\n## Expert field notes\nThe following input was approved with this brief. In the sample scenario, it represents a fictional knowledge keeper.\n\n${expert}\n\n## Working context for this article\n${record.sources.filter(s=>['Expert knowledge','Case library','Customer voice'].includes(s.kind)).map(s=>`### ${s.title}\n${s.text}`).join('\n\n')}\n\n## Frequently asked questions\n### Where should we start?\nStart with one representative task, a clear owner and a small sample. The purpose is to make the process observable before expanding it.\n\n### How should we judge the result?\nAgree on acceptance criteria in advance, then review the output with the receiving team. Record the reason when an example does not meet the standard.\n\n### When should we change the process?\nChange it when repeated examples reveal the same gap. Review one change at a time and keep the decision linked to the evidence.\n\n## Editorial handoff\nThis demonstration draft uses a prepared article structure and the approved expert responses. Review it against the approved brief before release. Live claims, external citations and internal links require verification in a production workflow.\n\n## Source notes\n${record.sources.map(s=>'- '+s.title+' · '+s.owner).join('\n')}`;
}
export function reviseDraft(text,mode){
 const lines=text.split('\n');
 if(mode==='intro') {const index=lines.findIndex((s,i)=>i>0&&s.trim());lines[index]='Start with one clearly defined workflow, test it on a small sample and agree on the criteria for success before scaling. Give the work an owner and keep the reasoning behind each decision visible to the next person.';return lines.join('\n');}
 if(mode==='checklist')return text+'\n\n## Before you put this into practice\n- Define the reader or buyer you are trying to help.\n- Agree on one measurable acceptance rule.\n- Review a small, realistic example together.\n- Record the decision and its evidence.\n- Assign an owner for the next review.';
 return text;
}
export function markdown(text){
 const lines=escapeHTML(text).split('\n');let html='',list=false,table=false;
 const inline=s=>s.replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');
 for(const line of lines){
 if(line.startsWith('|')){if(!table){html+='<div class="table-scroll"><table>';table=true;}if(/^\|[\s|:-]+\|$/.test(line))continue;html+='<tr>'+line.split('|').slice(1,-1).map(c=>'<td>'+inline(c.trim())+'</td>').join('')+'</tr>';continue;}
 if(table){html+='</table></div>';table=false;}
 if(line.startsWith('- ')){if(!list){html+='<ul>';list=true;}html+='<li>'+inline(line.slice(2))+'</li>';continue;}if(list){html+='</ul>';list=false;}
 const h=line.match(/^(#{1,3}) (.*)/);html+=h?`<h${h[1].length}>${inline(h[2])}</h${h[1].length}>`:line.trim()?'<p>'+inline(line)+'</p>':'';
 }return html+(list?'</ul>':'')+(table?'</table></div>':'');
}
export const words=s=>(s.trim().match(/\S+/g)||[]).length;
export function checks(record){const text=record.draft||'';return [
 {label:'Primary keyword included',ok:text.toLowerCase().includes(record.keyword.toLowerCase())},
 {label:'Clear heading structure',ok:(text.match(/^## /gm)||[]).length>=4},
 {label:'Expert input included',ok:record.answers.length>0&&record.answers.every(a=>text.includes(a.trim()))},
 {label:'Source notes present',ok:text.includes('## Source notes')},
 {label:'Frequently asked questions',ok:text.includes('## Frequently asked questions')},
 {label:'Within target length (±25%)',ok:words(text)>=record.target*.75&&words(text)<=record.target*1.25}
];}
