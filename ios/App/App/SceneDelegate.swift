import UIKit
import Capacitor

class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(_ scene: UIScene, willConnectTo session: UISceneSession, options connectionOptions: UIScene.ConnectionOptions) {
        guard let windowScene = scene as? UIWindowScene else { return }

        let window = UIWindow(windowScene: windowScene)
        window.backgroundColor = UIColor(red: 0.027, green: 0.078, blue: 0.153, alpha: 1)
        window.rootViewController = CAPBridgeViewController()
        window.makeKeyAndVisible()
        self.window = window

        PickemLaunchOverlay.present(in: window)
        SceneDelegateProxy.shared.scene(scene, willConnectTo: session, options: connectionOptions)
    }

    func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
        SceneDelegateProxy.shared.scene(scene, openURLContexts: URLContexts)
    }

    func scene(_ scene: UIScene, continue userActivity: NSUserActivity) {
        SceneDelegateProxy.shared.scene(scene, continue: userActivity)
    }
}

private final class PickemLaunchOverlay: UIView {
    private let ticket = UIView()
    private let titleLabel = UILabel()
    private let subtitleLabel = UILabel()
    private let checkLayer = CAShapeLayer()
    private let accentLayer = CAGradientLayer()

    static func present(in window: UIWindow) {
        let overlay = PickemLaunchOverlay(frame: window.bounds)
        overlay.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        window.addSubview(overlay)
        overlay.play()
    }

    private override init(frame: CGRect) {
        super.init(frame: frame)
        backgroundColor = UIColor(red: 0.027, green: 0.078, blue: 0.153, alpha: 1)
        isUserInteractionEnabled = false
        setup()
    }

    required init?(coder: NSCoder) { nil }

    private func setup() {
        let glow = UIView()
        glow.translatesAutoresizingMaskIntoConstraints = false
        glow.backgroundColor = UIColor(red: 0.08, green: 0.88, blue: 0.58, alpha: 0.18)
        glow.layer.cornerRadius = 190
        glow.layer.shadowColor = UIColor(red: 0.08, green: 0.88, blue: 0.58, alpha: 1).cgColor
        glow.layer.shadowOpacity = 0.45
        glow.layer.shadowRadius = 65
        addSubview(glow)

        ticket.translatesAutoresizingMaskIntoConstraints = false
        ticket.layer.cornerRadius = 30
        ticket.layer.cornerCurve = .continuous
        ticket.layer.masksToBounds = true
        ticket.layer.shadowColor = UIColor.black.cgColor
        ticket.layer.shadowOpacity = 0.32
        ticket.layer.shadowRadius = 22
        ticket.layer.shadowOffset = CGSize(width: 0, height: 14)
        addSubview(ticket)

        accentLayer.colors = [
            UIColor(red: 0.04, green: 0.54, blue: 0.36, alpha: 1).cgColor,
            UIColor(red: 0.11, green: 0.88, blue: 0.58, alpha: 1).cgColor,
            UIColor(red: 0.02, green: 0.45, blue: 0.31, alpha: 1).cgColor
        ]
        accentLayer.startPoint = CGPoint(x: 0, y: 0)
        accentLayer.endPoint = CGPoint(x: 1, y: 1)
        ticket.layer.insertSublayer(accentLayer, at: 0)

        let topNotch = notch()
        let bottomNotch = notch()
        ticket.addSubview(topNotch)
        ticket.addSubview(bottomNotch)
        NSLayoutConstraint.activate([
            topNotch.centerYAnchor.constraint(equalTo: ticket.topAnchor),
            topNotch.centerXAnchor.constraint(equalTo: ticket.centerXAnchor),
            topNotch.widthAnchor.constraint(equalToConstant: 28),
            topNotch.heightAnchor.constraint(equalToConstant: 14),
            bottomNotch.centerYAnchor.constraint(equalTo: ticket.bottomAnchor),
            bottomNotch.centerXAnchor.constraint(equalTo: ticket.centerXAnchor),
            bottomNotch.widthAnchor.constraint(equalToConstant: 28),
            bottomNotch.heightAnchor.constraint(equalToConstant: 14)
        ])

        let lineTop = detailLine()
        let lineBottom = detailLine()
        ticket.addSubview(lineTop)
        ticket.addSubview(lineBottom)
        NSLayoutConstraint.activate([
            lineTop.leadingAnchor.constraint(equalTo: ticket.leadingAnchor, constant: 24),
            lineTop.topAnchor.constraint(equalTo: ticket.topAnchor, constant: 24),
            lineTop.widthAnchor.constraint(equalToConstant: 52),
            lineTop.heightAnchor.constraint(equalToConstant: 6),
            lineBottom.trailingAnchor.constraint(equalTo: ticket.trailingAnchor, constant: -24),
            lineBottom.bottomAnchor.constraint(equalTo: ticket.bottomAnchor, constant: -24),
            lineBottom.widthAnchor.constraint(equalToConstant: 52),
            lineBottom.heightAnchor.constraint(equalToConstant: 6)
        ])

        titleLabel.translatesAutoresizingMaskIntoConstraints = false
        titleLabel.text = "PICKEM HQ"
        titleLabel.font = .systemFont(ofSize: 28, weight: .black)
        titleLabel.textColor = UIColor(white: 0.96, alpha: 1)
        titleLabel.textAlignment = .center
        titleLabel.adjustsFontForContentSizeCategory = true
        titleLabel.alpha = 0
        addSubview(titleLabel)

        subtitleLabel.translatesAutoresizingMaskIntoConstraints = false
        subtitleLabel.text = "YOUR LEAGUE. YOUR PICKS."
        subtitleLabel.font = .monospacedSystemFont(ofSize: 11, weight: .bold)
        subtitleLabel.textColor = UIColor(red: 0.32, green: 0.9, blue: 0.66, alpha: 1)
        subtitleLabel.textAlignment = .center
        subtitleLabel.alpha = 0
        addSubview(subtitleLabel)

        NSLayoutConstraint.activate([
            glow.centerXAnchor.constraint(equalTo: centerXAnchor),
            glow.centerYAnchor.constraint(equalTo: centerYAnchor, constant: -36),
            glow.widthAnchor.constraint(equalToConstant: 255),
            glow.heightAnchor.constraint(equalToConstant: 255),
            ticket.centerXAnchor.constraint(equalTo: centerXAnchor),
            ticket.centerYAnchor.constraint(equalTo: centerYAnchor, constant: -48),
            ticket.widthAnchor.constraint(equalToConstant: 184),
            ticket.heightAnchor.constraint(equalToConstant: 128),
            titleLabel.topAnchor.constraint(equalTo: ticket.bottomAnchor, constant: 40),
            titleLabel.centerXAnchor.constraint(equalTo: centerXAnchor),
            subtitleLabel.topAnchor.constraint(equalTo: titleLabel.bottomAnchor, constant: 10),
            subtitleLabel.centerXAnchor.constraint(equalTo: centerXAnchor)
        ])

        ticket.transform = CGAffineTransform(scaleX: 0.72, y: 0.72).translatedBy(x: 0, y: 30)
        ticket.alpha = 0
    }

    override func layoutSubviews() {
        super.layoutSubviews()
        accentLayer.frame = ticket.bounds
        addCheckmark()
    }

    private func notch() -> UIView {
        let view = UIView()
        view.translatesAutoresizingMaskIntoConstraints = false
        view.backgroundColor = UIColor(red: 0.027, green: 0.078, blue: 0.153, alpha: 1)
        view.layer.cornerRadius = 7
        view.layer.cornerCurve = .continuous
        return view
    }

    private func detailLine() -> UIView {
        let view = UIView()
        view.translatesAutoresizingMaskIntoConstraints = false
        view.backgroundColor = UIColor(white: 1, alpha: 0.28)
        view.layer.cornerRadius = 3
        return view
    }

    private func addCheckmark() {
        guard checkLayer.superlayer == nil, ticket.bounds.width > 0 else { return }
        let path = UIBezierPath()
        let midY = ticket.bounds.midY + 8
        path.move(to: CGPoint(x: ticket.bounds.width * 0.27, y: midY))
        path.addLine(to: CGPoint(x: ticket.bounds.width * 0.44, y: ticket.bounds.height * 0.67))
        path.addLine(to: CGPoint(x: ticket.bounds.width * 0.75, y: ticket.bounds.height * 0.33))
        checkLayer.path = path.cgPath
        checkLayer.fillColor = UIColor.clear.cgColor
        checkLayer.strokeColor = UIColor(white: 1, alpha: 0.98).cgColor
        checkLayer.lineWidth = 13
        checkLayer.lineCap = .round
        checkLayer.lineJoin = .round
        checkLayer.strokeEnd = 0
        ticket.layer.addSublayer(checkLayer)
    }

    private func play() {
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.08) { [weak self] in
            guard let self else { return }
            UIView.animate(withDuration: 0.42, delay: 0, usingSpringWithDamping: 0.72, initialSpringVelocity: 0.4, options: [.curveEaseOut]) {
                self.ticket.alpha = 1
                self.ticket.transform = .identity
            }
            let draw = CABasicAnimation(keyPath: "strokeEnd")
            draw.fromValue = 0
            draw.toValue = 1
            draw.duration = 0.42
            draw.beginTime = CACurrentMediaTime() + 0.24
            draw.timingFunction = CAMediaTimingFunction(name: .easeInEaseOut)
            self.checkLayer.add(draw, forKey: "drawCheck")
            self.checkLayer.strokeEnd = 1
            UIView.animate(withDuration: 0.28, delay: 0.55, options: [.curveEaseOut]) {
                self.titleLabel.alpha = 1
                self.subtitleLabel.alpha = 1
            }
            UIView.animate(withDuration: 0.34, delay: 1.22, options: [.curveEaseIn]) {
                self.alpha = 0
            } completion: { _ in
                self.removeFromSuperview()
            }
        }
    }
}
