import React from 'react';
import { Dialog, DialogContent, Typography } from '@mui/material';

export const AboutDialog = ({ open, setOpen }) => {
    const handleClose = React.useCallback(() => {
        console.log('handleClose');
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
                    過去のトラックを様々な条件で検索し、3D Mapに表示することができます。<br />
                    WeFlyを使うことでパイロットが抱える以下のような「？」を解決する手助けになれば幸いです。<br />
                    <ul>
                        <li>今日仕事で飛べなかったんだけどコンディション良さそうだったな。みんなどんなフライトをしたんだろう？</li>
                        <li>来週初めて〇〇のエリアで飛ぶんだけど、どういう飛び方をすればいいのかな？</li>
                        <li>〇〇さんと一緒に飛んでたのに自分だけ高度を失ってしまった。自分の飛びのどこが悪かったんだろう？</li>
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
                    継続的な運営のために、様々なご協力をお願いすることもあるかと思いますが、ご容赦ください。
                </Typography>

                <Typography variant="caption">
                    © 2024 wefly.tokyo K.Takase
                </Typography>
            </DialogContent>
        </Dialog >
    );
};