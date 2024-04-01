import React from 'react';
import { Dialog, DialogContent, Typography } from '@mui/material';

export const AboutDialog = ({ open, setOpen }) => {
    const handleClose = React.useCallback(() => {
        setOpen(false);
    }, [open]);

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogContent>
                <Typography variant="h6" gutterBottom>
                    WeFlyについて
                </Typography>
                <Typography component={'span'} variant="body2" gutterBottom>
                    WeFlyはパラグライダー・ハンググライダー・グライダーパイロットのためのフライトログ閲覧、分析プラットフォームです。<br />
                    WeFlyを使うことでパイロットが抱える次のような様々なニーズを満たすことができたら幸いです。<br />
                    <ul>
                        <li>今日のみんなの飛びをチェックして、すごいフライトをした人を見つけたい</li>
                        <li>100kmを超えるビッグフライトを検索して、自分のフライトに活かしたい</li>
                        <li>来週初めてのエリアで飛ぶんだけど、どういう飛び方をすればいいのか予習したい</li>
                    </ul>
                </Typography>

                <Typography variant="h6" gutterBottom>
                    データソースについて
                </Typography>
                <Typography variant="body2" gutterBottom>
                    WeFlyはLiveTrack24にアップロードされたランディング済みのトラックを30分間隔で収集しています。<br />
                    現時点では日本の2022年1月1日以降のトラックのみを対象としています。
                </Typography>

                <Typography variant="h6" gutterBottom>
                    開発・運営について
                </Typography>
                <Typography variant="body2" gutterBottom>
                    WeFlyは個人的なプロジェクトであり、機能開発やバグ修正には時間を要することがあります。<br />
                    継続的な運営のために、様々なご協力をお願いすることもあるかと思いますが、よろしくお願いいたします。<br />
                </Typography>

                <Typography variant="caption">
                    © 2024 wefly.tokyo K.Takase
                </Typography>
            </DialogContent>
        </Dialog >
    );
};